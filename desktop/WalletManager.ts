import * as R from 'ramda';
import { ipcMain, BrowserWindow } from 'electron';
import { ipcConsts } from '../app/vars';
import { KeyPair, Activation, Wallet } from '../shared/types';
import {
  delay,
  isLocalNodeType,
  isRemoteNodeApi,
  toSocketAddress,
} from '../shared/utils';
import { Reward__Output } from '../proto/spacemesh/v1/Reward';
import { isActivation, isNodeError } from '../shared/types/guards';
import { CurrentLayer, GlobalStateHash } from '../app/types/events';
import MeshService from './MeshService';
import GlobalStateService from './GlobalStateService';
import TransactionManager from './TransactionManager';
import cryptoService from './cryptoService';
import NodeManager from './NodeManager';
import TransactionService from './TransactionService';
import Logger from './logger';
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
      mainWindow,
      this.nodeManager.getNetId()
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

    ipcMain.handle(ipcConsts.W_M_SPAWN_TX, async (_event, request) => {
      const res = await this.txManager.publishSelfSpawn(
        request.fee,
        request.accountIndex
      );
      return res;
    });
    ipcMain.handle(ipcConsts.W_M_SEND_TX, async (_event, request) => {
      const res = await this.txManager.publishSpendTx({ ...request });
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
        secretKey: this.txManager.keychain[accountIndex].secretKey,
      });
      return res;
    });

    return () => {
      console.log('Unsubscribe WalletManager IPC Events');
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
    let res = false;
    try {
      if (isLocalNodeType(wallet.meta.type)) {
        res = await this.nodeManager.startNode();
        if (!res) return false;
      } else {
        await this.nodeManager.stopNode();
        if (!!apiUrl && isRemoteNodeApi(apiUrl)) {
          res = await this.nodeManager.connectToRemoteNode(apiUrl);
        }
      }
      this.meshService.createService(apiUrl);
      this.glStateService.createService(apiUrl);
      this.txService.createService(apiUrl);
    } catch (err) {
      logger.error('activate', err);
      if (isNodeError(err)) {
        this.nodeManager.sendNodeError(err);
      }
    }
    return res;
  };

  activateAccounts = (accounts: KeyPair[]) => {
    this.txManager.setAccounts(accounts);
  };

  requestActivationsByCoinbase = async (
    coinbase: string
  ): Promise<Activation[]> => {
    const res = await this.meshService.requestMeshActivations(coinbase, 0);
    if (!res) {
      logger.debug(
        `meshService.requestMeshActivations(${coinbase}, 0) returned`,
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
    coinbase: string
  ): Promise<Reward__Output[]> => this.txManager.retrieveRewards(coinbase);

  listenRewardsByCoinbase = (
    coinbase: string,
    handler: (reward: Reward__Output) => void
  ) => this.glStateService.listenRewardsByCoinbase(coinbase, handler);

  listenActivationsByCoinbase = (
    coinbase: string,
    handler: (atx: Activation) => void
  ) => this.meshService.listenMeshActivations(coinbase, handler);
}

export default WalletManager;
