import { ProtoGrpcType } from '../api/generated';
import { Account__Output } from '../api/generated/spacemesh/v1/Account';
import { AccountData__Output } from '../api/generated/spacemesh/v1/AccountData';
import { AccountDataFlag } from '../api/generated/spacemesh/v1/AccountDataFlag';
import { AccountDataStreamResponse__Output } from '../api/generated/spacemesh/v1/AccountDataStreamResponse';
import { Reward__Output } from '../api/generated/spacemesh/v1/Reward';
import { TransactionReceipt__Output } from '../api/generated/spacemesh/v1/TransactionReceipt';
import { PublicService, SocketAddress } from '../shared/types';
import { toHexString } from '../shared/utils';
import { GlobalStateHash } from '../app/types/events';
import Logger from './logger';
import NetServiceFactory from './NetServiceFactory';
import { GRPC_QUERY_BATCH_SIZE } from './main/constants';

const PROTO_PATH = 'vendor/api/spacemesh/v1/global_state.proto';

export interface AccountDataStreamHandlerArg {
  [AccountDataFlag.ACCOUNT_DATA_FLAG_REWARD]: Reward__Output;
  [AccountDataFlag.ACCOUNT_DATA_FLAG_ACCOUNT]: Account__Output;
  [AccountDataFlag.ACCOUNT_DATA_FLAG_TRANSACTION_RECEIPT]: TransactionReceipt__Output;
}

export type AccountDataValidFlags = Exclude<
  AccountDataFlag,
  AccountDataFlag.ACCOUNT_DATA_FLAG_UNSPECIFIED
>;
type AccountDataStreamKey = Exclude<keyof AccountData__Output, 'datum'>;

const ACCOUNT_DATA_KEYS: Record<AccountDataValidFlags, AccountDataStreamKey> = {
  [AccountDataFlag.ACCOUNT_DATA_FLAG_REWARD]: 'reward',
  [AccountDataFlag.ACCOUNT_DATA_FLAG_TRANSACTION_RECEIPT]: 'receipt',
  [AccountDataFlag.ACCOUNT_DATA_FLAG_ACCOUNT]: 'accountWrapper',
};
const getKeyByAccountDataFlag = (
  flag: AccountDataValidFlags
): AccountDataStreamKey => ACCOUNT_DATA_KEYS[flag];
const getByFlag = <F extends AccountDataValidFlags>(
  flag: F,
  from: AccountData__Output
): AccountDataStreamHandlerArg[F] | null | undefined => {
  const key = getKeyByAccountDataFlag(flag);
  const res = from[key] as AccountDataStreamHandlerArg[F] | null | undefined;
  return res;
};

class GlobalStateService extends NetServiceFactory<
  ProtoGrpcType,
  'v1',
  'GlobalStateService'
> {
  logger = Logger({ className: 'GlobalStateService' });

  createService = (apiUrl?: SocketAddress | PublicService) => {
    this.createNetService(PROTO_PATH, apiUrl, 'GlobalStateService');
  };

  getGlobalStateHash = (): Promise<GlobalStateHash> =>
    this.callServiceWithRetries('GlobalStateHash', {})
      .then((response) => ({
        layer: response.response?.layer?.number || 0,
        rootHash: response.response?.rootHash
          ? toHexString(response.response.rootHash)
          : '',
      }))
      .catch((err) => {
        this.logger.error('getGlobalStateHash', err);
        return { layer: 0, rootHash: '' };
      });

  sendAccountDataQuery = <F extends AccountDataValidFlags>(
    {
      filter,
      offset,
    }: {
      filter: {
        accountId: { address: string };
        accountDataFlags: F;
      };
      offset: number;
    },
    retries = 300
  ): Promise<{
    totalResults: number;
    data: AccountDataStreamHandlerArg[F][];
    error: null | Error;
  }> =>
    this.callServiceWithRetries(
      'AccountDataQuery',
      {
        filter,
        maxResults: GRPC_QUERY_BATCH_SIZE,
        offset,
      },
      retries
    )
      .then((response) => ({
        totalResults: response?.totalResults || 0,
        data: (response?.accountItem || [])
          .map((item) => getByFlag(filter.accountDataFlags, item))
          .filter(Boolean) as AccountDataStreamHandlerArg[F][],
      }))
      .then(this.normalizeServiceResponse)
      .catch(
        this.normalizeServiceError({
          totalResults: 0,
          data: <AccountDataStreamHandlerArg[F][]>[],
        })
      );

  activateAccountDataStream = <K extends AccountDataValidFlags>(
    address: string,
    accountDataFlags: K,
    handler: (data: AccountDataStreamHandlerArg[K]) => void
  ) =>
    this.runStream(
      'AccountDataStream',
      {
        filter: {
          accountId: { address },
          accountDataFlags,
        },
      },
      (data: AccountDataStreamResponse__Output) => {
        const { datum } = data;
        const key = getKeyByAccountDataFlag(accountDataFlags);
        if (datum && datum[key]) {
          const value = datum[key] as AccountDataStreamHandlerArg[K];
          handler(value);
        }
      }
    );

  listenRewardsByCoinbase = (
    coinbase: string,
    handler: (data: Reward__Output) => void
  ) =>
    this.activateAccountDataStream(
      coinbase,
      AccountDataFlag.ACCOUNT_DATA_FLAG_REWARD,
      handler
    );
}

export default GlobalStateService;
