import { BrowserWindow, ipcMain } from 'electron';
import { ipcConsts } from '../app/vars';
import { KeyPair, Reward, Wallet } from '../shared/types';
import {
  delay,
  isLocalNodeType,
  isRemoteNodeApi,
  toHexString,
} from '../shared/utils';
import { Reward__Output } from '../proto/spacemesh/v1/Reward';
import { isNodeError } from '../shared/types/guards';
import { CurrentLayer, GlobalStateHash } from '../app/types/events';
import MeshService from './MeshService';
import GlobalStateService from './GlobalStateService';
import TransactionManager from './TransactionManager';
import NodeManager from './NodeManager';
import TransactionService from './TransactionService';
import Logger from './logger';
import AbstractManager from './AbstractManager';
import { sign } from './ed25519';
import { toSocketAddress } from './main/utils';

const logger = Logger({ className: 'WalletManager' });

class WalletManager extends AbstractManager {
  private readonly meshService: MeshService;

  private readonly glStateService: GlobalStateService;

  private readonly txService: TransactionService;

  private nodeManager: NodeManager;

  private txManager: TransactionManager;

  constructor(mainWindow: BrowserWindow, nodeManager: NodeManager) {
    super(mainWindow);
    this.nodeManager = nodeManager;
    this.meshService = new MeshService();
    this.glStateService = new GlobalStateService();
    this.txService = new TransactionService();
    this.txManager = new TransactionManager(
      this.meshService,
      this.glStateService,
      this.txService,
      mainWindow,
      this.nodeManager.getGenesisID()
    );
  }

  setBrowserWindow = (mainWindow: BrowserWindow, force = false) => {
    // Propagate `setBrowserWindow` to TxManager
    super.setBrowserWindow(mainWindow, force);
    this.txManager.setBrowserWindow(mainWindow, force);
  };

  unsubscribeAllStreams = () => this.txManager.unsubscribeAllStreams();

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

  subscribeIPCEvents() {
    ipcMain.handle(ipcConsts.W_M_GET_CURRENT_LAYER, () =>
      this.getCurrentLayer()
    );
    ipcMain.handle(ipcConsts.W_M_GET_GLOBAL_STATE_HASH, () =>
      this.getRootHash()
    );

    ipcMain.handle(ipcConsts.W_M_GET_TX_MAX_GAS, (_event, request) =>
      this.txManager
        .getMaxGas(
          request.templateAddress,
          request.method,
          request.payload,
          request.accountIndex
        )
        .catch(() => 0)
    );

    ipcMain.handle(ipcConsts.W_M_SPAWN_TX, async (_event, request) => {
      return this.txManager.publishSelfSpawn(request.fee, request.accountIndex);
    });
    ipcMain.handle(ipcConsts.W_M_SEND_TX, async (_event, request) => {
      return this.txManager.publishSpendTx({ ...request });
    });
    ipcMain.handle(ipcConsts.W_M_UPDATE_TX_NOTE, async (_event, request) => {
      await this.txManager.updateTxNote(request);
      return true;
    });

    const enc = new TextEncoder();
    ipcMain.handle(
      ipcConsts.W_M_SIGN_MESSAGE,
      async (
        _event,
        { message, accountIndex }: { message: string; accountIndex: number }
      ) =>
        toHexString(
          sign(
            enc.encode(message),
            this.txManager.keychain[accountIndex].secretKey
          )
        )
    );

    return () => {
      ipcMain.removeHandler(ipcConsts.W_M_GET_CURRENT_LAYER);
      ipcMain.removeHandler(ipcConsts.W_M_GET_GLOBAL_STATE_HASH);
      ipcMain.removeHandler(ipcConsts.W_M_SEND_TX);
      ipcMain.removeHandler(ipcConsts.W_M_UPDATE_TX_NOTE);
      ipcMain.removeHandler(ipcConsts.W_M_SIGN_MESSAGE);
    };
  }

  unsubscribe = () => {
    this.txManager.unsubscribeAllStreams();
    this.txService.cancelStreams();
    this.meshService.cancelStreams();
    this.glStateService.cancelStreams();
    this.unsubscribeIPC();
  };

  private stopServices() {
    this.meshService.cancelStreams();
    this.meshService.dropNetService();
    this.glStateService.cancelStreams();
    this.glStateService.dropNetService();
    this.txService.cancelStreams();
    this.txService.dropNetService();
  }

  activate = async (wallet: Wallet) => {
    const apiUrl = toSocketAddress(wallet.meta.remoteApi);
    let res = false;
    try {
      this.stopServices();

      const prevGenesisId = this.nodeManager.getGenesisID();
      const actualGenesisId = wallet.meta.genesisID;
      const isNewGenesisId = prevGenesisId !== actualGenesisId;
      if (isNewGenesisId) {
        this.nodeManager.setGenesisID(actualGenesisId);
        this.txManager.setGenesisID(actualGenesisId);
      }
      if (isLocalNodeType(wallet.meta.type)) {
        res =
          isNewGenesisId && this.nodeManager.isNodeRunning()
            ? await this.nodeManager.restartNode()
            : await this.nodeManager.startNode();
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

  getStoredRewards = (coinbase: HexString) =>
    this.txManager.getStoredRewards(coinbase);

  requestRewardsByCoinbase = async (coinbase: string): Promise<Reward[]> =>
    this.txManager.retrieveNewRewards(coinbase);

  listenRewardsByCoinbase = (
    coinbase: string,
    handler: (reward: Reward__Output) => void
  ) => this.glStateService.listenRewardsByCoinbase(coinbase, handler);
}

export default WalletManager;
