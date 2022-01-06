import { ipcMain, BrowserWindow } from 'electron';
import { ipcConsts } from '../app/vars';
import { Account, Wallet } from '../shared/types';
import { isLocalNodeApi, toSocketAddress } from '../shared/utils';
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

  constructor(mainWindow: BrowserWindow, nodeManager: NodeManager) {
    this.subscribeToEvents();
    this.nodeManager = nodeManager;
    this.meshService = new MeshService();
    this.glStateService = new GlobalStateService();
    this.txService = new TransactionService();
    this.txManager = new TransactionManager(this.meshService, this.glStateService, this.txService, mainWindow);
  }

  __getNewAccountFromTemplate = ({ index, timestamp, publicKey, secretKey }: { index: number; timestamp: string; publicKey: string; secretKey: string }) => ({
    displayName: index > 0 ? `Account ${index}` : 'Main Account',
    created: timestamp,
    path: `0/0/${index}`,
    publicKey,
    secretKey,
  });

  subscribeToEvents = () => {
    ipcMain.handle(ipcConsts.W_M_GET_CURRENT_LAYER, () => this.meshService.getCurrentLayer());
    ipcMain.handle(ipcConsts.W_M_GET_GLOBAL_STATE_HASH, () => this.glStateService.getGlobalStateHash());

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
      const res = await cryptoService.signMessage({ message, secretKey: this.txManager.accounts[accountIndex].secretKey });
      return res;
    });
  };

  activate = async (wallet: Wallet) => {
    const apiUrl = toSocketAddress(wallet.meta.remoteApi);
    if (isLocalNodeApi(apiUrl)) await this.nodeManager.startNode();
    else {
      await this.nodeManager.stopNode();
      this.nodeManager.connectToRemoteNode(apiUrl);
    }

    this.meshService.createService(apiUrl);
    this.glStateService.createService(apiUrl);
    this.txService.createService(apiUrl);
  };

  activateAccounts = (accounts: Account[]) => {
    this.txManager.setAccounts(accounts);
  };
}

export default WalletManager;
