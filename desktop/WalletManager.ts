import { ipcMain, BrowserWindow } from 'electron';
import { ipcConsts } from '../app/vars';
import { Account, Wallet } from '../shared/types';
import {
  isLocalNodeType,
  isRemoteNodeApi,
  toSocketAddress,
} from '../shared/utils';
import { isNodeError } from '../shared/types/guards';
import { CurrentLayer, GlobalStateHash } from '../app/types/events';
import MeshService from './MeshService';
import GlobalStateService from './GlobalStateService';
import TransactionManager from './TransactionManager';
import cryptoService from './cryptoService';
import NodeManager from './NodeManager';
import TransactionService from './TransactionService';

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

  subscribeToEvents = () => {
    ipcMain.handle(
      ipcConsts.W_M_GET_CURRENT_LAYER,
      (): Promise<CurrentLayer> => this.meshService.getCurrentLayer()
    );
    ipcMain.handle(
      ipcConsts.W_M_GET_GLOBAL_STATE_HASH,
      (): Promise<GlobalStateHash> => this.glStateService.getGlobalStateHash()
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
        if (isRemoteNodeApi(apiUrl)) {
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

  getCurrentLayer = () => this.meshService.getCurrentLayer();
}

export default WalletManager;
