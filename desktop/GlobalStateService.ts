import { ProtoGrpcType } from '../proto/global_state';
import { Account__Output } from '../proto/spacemesh/v1/Account';
import { AccountData__Output } from '../proto/spacemesh/v1/AccountData';
import { AccountDataFlag } from '../proto/spacemesh/v1/AccountDataFlag';
import { AccountDataStreamResponse__Output } from '../proto/spacemesh/v1/AccountDataStreamResponse';
import { Reward__Output } from '../proto/spacemesh/v1/Reward';
import { TransactionReceipt__Output } from '../proto/spacemesh/v1/TransactionReceipt';
import { PublicService, SocketAddress } from '../shared/types';
import Logger from './logger';
import NetServiceFactory from './NetServiceFactory';
import { toHexString } from './utils';

const PROTO_PATH = 'proto/global_state.proto';

interface AccountDataStreamHandlerArg {
  [AccountDataFlag.ACCOUNT_DATA_FLAG_REWARD]: Reward__Output;
  [AccountDataFlag.ACCOUNT_DATA_FLAG_ACCOUNT]: Account__Output;
  [AccountDataFlag.ACCOUNT_DATA_FLAG_TRANSACTION_RECEIPT]: TransactionReceipt__Output;
}

type AccountDataValidFlags = Exclude<AccountDataFlag, AccountDataFlag.ACCOUNT_DATA_FLAG_UNSPECIFIED>;
type AccountDataStreamKey = Exclude<keyof AccountData__Output, 'datum'>;
const getKeyByAccoundDataFlag = (flag: AccountDataValidFlags): AccountDataStreamKey => {
  const keys: Record<AccountDataValidFlags, AccountDataStreamKey> = {
    [AccountDataFlag.ACCOUNT_DATA_FLAG_REWARD]: 'reward',
    [AccountDataFlag.ACCOUNT_DATA_FLAG_TRANSACTION_RECEIPT]: 'receipt',
    [AccountDataFlag.ACCOUNT_DATA_FLAG_ACCOUNT]: 'accountWrapper',
  };
  return keys[flag];
};

class GlobalStateService extends NetServiceFactory<ProtoGrpcType, 'GlobalStateService'> {
  logger = Logger({ className: 'GlobalStateService' });

  createService = (apiUrl?: SocketAddress | PublicService) => {
    this.createNetService(PROTO_PATH, apiUrl, 'GlobalStateService');
  };

  getGlobalStateHash = () =>
    this.callService('GlobalStateHash', {})
      .then((response) => ({
        layer: response.response?.layer?.number || 0,
        rootHash: response.response?.rootHash ? toHexString(response.response.rootHash) : '',
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ layer: -1, rootHash: '' }));

  sendAccountDataQuery = ({ filter, offset }: { filter: { accountId: { address: Uint8Array }; accountDataFlags: AccountDataFlag }; offset: number }) =>
    this.callService('AccountDataQuery', { filter, maxResults: 50, offset })
      .then((response) => ({
        totalResults: response.totalResults,
        data: response.accountItem,
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ totalResults: 0, data: [] }));

  activateAccountDataStream = (
    address: Uint8Array,
    accountDataFlags: AccountDataValidFlags,
    handler: (data: AccountDataStreamHandlerArg[keyof AccountDataStreamHandlerArg]) => void
  ) => {
    if (!this.service) {
      throw new Error(`GlobalStateService is not running`);
    }
    const key = getKeyByAccoundDataFlag(accountDataFlags);

    const stream = this.service.AccountDataStream({ filter: { accountId: { address }, accountDataFlags } });
    stream.on('data', (response: AccountDataStreamResponse__Output) => {
      const { datum } = response;
      if (datum && datum[key]) {
        const value = datum[key];
        value && handler(value);
      }
    });
    stream.on('error', (error: Error & { code: number }) => {
      if (error.code === 1) return; // Cancelled on client
      console.log(`stream AccountDataStream error: ${error}`); // eslint-disable-line no-console
      this.logger.error('grpc AccountDataStream', error);
    });
    stream.on('end', () => {
      console.log('grpc stream AccountDataStream ended'); // eslint-disable-line no-console
      this.logger.log('grpc AccountDataStream ended', null);
    });
    return () => setImmediate(() => stream.cancel());
  };
}

export default GlobalStateService;
