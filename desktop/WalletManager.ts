import * as R from 'ramda';
import { ipcMain, BrowserWindow } from 'electron';
import { ipcConsts } from '../app/vars';
import { Account, Activation, Wallet } from '../shared/types';
import {
  delay,
  isLocalNodeType,
  isRemoteNodeApi,
  toSocketAddress,
} from '../shared/utils';
import { Reward__Output } from '../proto/spacemesh/v1/Reward';
import { AccountDataFlag } from '../proto/spacemesh/v1/AccountDataFlag';
import {
  hasRequiredRewardFields,
  isActivation,
  isNodeError,
} from '../shared/types/guards';
import { CurrentLayer, GlobalStateHash } from '../app/types/events';
import MeshService from './MeshService';
import GlobalStateService, {
  AccountDataValidFlags,
} from './GlobalStateService';
import TransactionManager from './TransactionManager';
import cryptoService from './cryptoService';
import NodeManager from './NodeManager';
import TransactionService from './TransactionService';
import Logger from './logger';
import { toHexString } from './utils';
import { GRPC_QUERY_BATCH_SIZE as BATCH_SIZE } from './main/constants';

const logger = Logger({ className: 'WalletManager' });

const pluckActivations = (list: any[]): Activation[] =>
  (list || []).reduce((acc, { activation }) => {
    if (isActivation(activation)) {
      return [...acc, activation];
    }
    return acc;
  }, <Activation[]>[]);

class WalletManager {
  private readonly meshService: MeshService;

  private readonly glStateService: GlobalStateService;

  private readonly txService: TransactionService;

  private nodeManager: NodeManager;

  private txManager: TransactionManager;

  private unsub = () => {};

  constructor(mainWindow: BrowserWindow, nodeManager: NodeManager) {
    this.unsub = this.subscribeToEvents();
    this.nodeManager = nodeManager;
    this.meshService = new MeshService();
    this.glStateService = new GlobalStateService();
    this.txService = new TransactionService();
    this.txManager = new TransactionManager(
      this.meshService,
      this.glStateService,
      this.txService,
      mainWindow
    );
  }

  __getNewAccountFromTemplate = ({
    index,
    timestamp,
    publicKey,
    secretKey,
  }: {
    index: number;
    timestamp: string;
    publicKey: string;
    secretKey: string;
  }) => ({
    displayName: index > 0 ? `Account ${index}` : 'Main Account',
    created: timestamp,
    path: `0/0/${index}`,
    publicKey,
    secretKey,
  });

  getCurrentLayer = (): Promise<CurrentLayer> =>
    this.meshService.getCurrentLayer().catch((err) => {
      logger.error('getCurrentLayer', err);
      // eslint-disable-next-line promise/no-nesting
      return delay(1000).then(() => this.getCurrentLayer());
    });

  getRootHash = (): Promise<GlobalStateHash> =>
    this.glStateService.getGlobalStateHash().catch((err) => {
      logger.error('getRootHash', err);
      // eslint-disable-next-line promise/no-nesting
      return delay(1000).then(() => this.getRootHash());
    });

  subscribeToEvents = () => {
    ipcMain.handle(ipcConsts.W_M_GET_CURRENT_LAYER, () =>
      this.getCurrentLayer()
    );
    ipcMain.handle(ipcConsts.W_M_GET_GLOBAL_STATE_HASH, () =>
      this.getRootHash()
    );

    ipcMain.handle(ipcConsts.W_M_SEND_TX, async (_event, request) => {
      const res = await this.txManager.sendTx({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.W_M_UPDATE_TX_NOTE, async (_event, request) => {
      await this.txManager.updateTxNote(request);
      return true;
    });
    ipcMain.handle(ipcConsts.W_M_SIGN_MESSAGE, async (_event, request) => {
      const { message, accountIndex } = request;
      const res = await cryptoService.signMessage({
        message,
        secretKey: this.txManager.accounts[accountIndex].secretKey,
      });
      return res;
    });

    return () => {
      ipcMain.removeHandler(ipcConsts.W_M_GET_CURRENT_LAYER);
      ipcMain.removeHandler(ipcConsts.W_M_GET_GLOBAL_STATE_HASH);
      ipcMain.removeHandler(ipcConsts.W_M_SEND_TX);
      ipcMain.removeHandler(ipcConsts.W_M_UPDATE_TX_NOTE);
      ipcMain.removeHandler(ipcConsts.W_M_SIGN_MESSAGE);
    };
  };

  unsubscribe = () => this.unsub();

  activate = async (wallet: Wallet) => {
    const apiUrl = toSocketAddress(wallet.meta.remoteApi);
    try {
      if (isLocalNodeType(wallet.meta.type)) await this.nodeManager.startNode();
      else {
        await this.nodeManager.stopNode();
        if (!!apiUrl && isRemoteNodeApi(apiUrl)) {
          await this.nodeManager.connectToRemoteNode(apiUrl);
        }
      }
    } catch (err) {
      if (isNodeError(err)) {
        this.nodeManager.sendNodeError(err);
      }
    }
    this.meshService.createService(apiUrl);
    this.glStateService.createService(apiUrl);
    this.txService.createService(apiUrl);
  };

  activateAccounts = (accounts: Account[]) => {
    this.txManager.setAccounts(accounts);
  };

  requestActivationsByCoinbase = async (
    coinbase: Uint8Array
  ): Promise<Activation[]> => {
    const res = await this.meshService.requestMeshActivations(coinbase, 0);
    if (!res) {
      const coinbaseHex = toHexString(coinbase);
      logger.debug(
        `meshService.requestMeshActivations(${coinbaseHex}, 0) returned`,
        res
      );
      logger.debug('SmesherId:', coinbase);
      return [];
    }
    const { totalResults, data } = res;

    const firstActivations = pluckActivations(data);
    if (totalResults <= BATCH_SIZE) {
      return firstActivations;
    } else {
      const nextData = await Promise.all(
        R.compose(
          R.map((idx) =>
            this.meshService
              .requestMeshActivations(coinbase, idx * BATCH_SIZE)
              .then((resp) => pluckActivations(resp.data))
          ),
          R.range(1)
        )(Math.ceil(totalResults / BATCH_SIZE))
      ).then(R.unnest);
      return [...firstActivations, ...nextData];
    }
  };

  requestRewardsByCoinbase = async (
    coinbase: Uint8Array
  ): Promise<Reward__Output[]> => {
    const composeArg = (batchNumber: number) => ({
      filter: {
        accountId: { address: coinbase },
        accountDataFlags: AccountDataFlag.ACCOUNT_DATA_FLAG_REWARD as AccountDataValidFlags,
      },
      offset: batchNumber * BATCH_SIZE,
    });
    const getAccountDataQuery = async (batch: number, retries = 5) => {
      const res = await this.glStateService.sendAccountDataQuery(
        composeArg(batch)
      );
      if (res.error && retries > 0) {
        await delay(1000);
        return getAccountDataQuery(batch, retries - 1);
      }
      return res;
    };
    const { totalResults, data } = await getAccountDataQuery(0);
    if (totalResults <= BATCH_SIZE) {
      const r: Reward__Output[] = data.filter(
        (item): item is Reward__Output =>
          !!item && hasRequiredRewardFields(item)
      );
      return r;
    } else {
      const nextRewards = await Promise.all(
        R.compose(
          R.map((idx) =>
            this.glStateService
              .sendAccountDataQuery(composeArg(idx))
              .then((resp) => resp.data)
          ),
          R.range(1)
        )(Math.ceil(totalResults / BATCH_SIZE))
      ).then(R.unnest);
      return data ? [...data, ...nextRewards] : nextRewards;
    }
  };

  listenRewardsByCoinbase = (
    coinbase: Uint8Array,
    handler: (reward: Reward__Output) => void
  ) => this.glStateService.listenRewardsByCoinbase(coinbase, handler);

  listenActivationsByCoinbase = (
    coinbase: Uint8Array,
    handler: (atx: Activation) => void
  ) => this.meshService.listenMeshActivations(coinbase, handler);
}

export default WalletManager;
