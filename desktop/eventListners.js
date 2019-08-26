import { BrowserWindow, ipcMain } from 'electron';
import { ipcConsts } from '../app/vars';
import FileManager from './fileManager';
import NodeManager from './nodeManager';
import DiskStorageManager from './diskStorageManager';
import netService from './netService';
import WalletAutoStarter from './autoStartManager';

const subscribeToEventListeners = ({ mainWindow }) => {
  ipcMain.on(ipcConsts.READ_FILE, async (event, request) => {
    FileManager.readFile({ event, ...request });
  });

  ipcMain.on(ipcConsts.COPY_FILE, async (event, request) => {
    FileManager.copyFile({ event, ...request });
  });

  ipcMain.on(ipcConsts.READ_DIRECTORY, async (event) => {
    FileManager.readDirectory({ browserWindow: mainWindow, event });
  });

  ipcMain.on(ipcConsts.SAVE_FILE, async (event, request) => {
    FileManager.writeFile({ event, ...request });
  });

  ipcMain.on(ipcConsts.UPDATE_FILE, async (event, request) => {
    FileManager.updateFile({ event, ...request });
  });

  ipcMain.on(ipcConsts.DELETE_FILE, async (event, request) => {
    FileManager.deleteWalletFile({ browserWindow: mainWindow, ...request });
  });

  ipcMain.on(ipcConsts.GET_DRIVE_LIST, (event) => {
    DiskStorageManager.getDriveList({ event });
  });

  ipcMain.on(ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY, async (event, request) => {
    FileManager.openWalletBackupDirectory({ event, ...request });
  });

  ipcMain.on(ipcConsts.PRINT, (event, request: { content: string }) => {
    const printerWindow = new BrowserWindow({ width: 800, height: 800, show: false, webPreferences: { devTools: false } });
    printerWindow.loadURL(`file://${__dirname}/printer.html`);
    printerWindow.webContents.on('did-finish-load', () => {
      printerWindow.webContents.send('LOAD_CONTENT_AND_PRINT', { content: request.content });
    });
  });

  ipcMain.on(ipcConsts.NOTIFICATION_CLICK, () => {
    mainWindow.show();
    mainWindow.focus();
  });

  ipcMain.on(ipcConsts.TOGGLE_AUTO_START, async () => {
    WalletAutoStarter.toggleAutoStart();
  });

  ipcMain.on(ipcConsts.IS_AUTO_START_ENABLED_REQUEST_RESPONSE, async (event) => {
    WalletAutoStarter.isEnabled({ event });
  });

  ipcMain.on(ipcConsts.START_NODE, async (event) => {
    NodeManager.startNode({ event });
  });

  ipcMain.on(ipcConsts.HARD_REFRESH, async () => {
    NodeManager.hardRefresh({ browserWindow: mainWindow });
  });

  /**
   ******************************************* gRPS Calls **************************************
   */
  ipcMain.on(ipcConsts.CHECK_NODE_CONNECTION, (event) => {
    netService.checkNetworkConnection({ event });
  });

  ipcMain.on(ipcConsts.GET_MINING_STATUS, (event) => {
    netService.getMiningStatus({ event });
  });

  ipcMain.on(ipcConsts.INIT_MINING, async (event, request) => {
    netService.initMining({ event, ...request });
  });

  ipcMain.on(ipcConsts.GET_GENESIS_TIME, (event) => {
    netService.getGenesisTime({ event });
  });

  ipcMain.on(ipcConsts.GET_UPCOMING_REWARDS, (event) => {
    netService.getUpcomingRewards({ event });
  });

  ipcMain.on(ipcConsts.SET_AWARDS_ADDRESS, (event, request) => {
    netService.setAwardsAddress({ event, ...request });
  });

  ipcMain.on(ipcConsts.SET_NODE_IP, async (event, request) => {
    netService.setNodeIpAddress({ event, ...request });
  });

  ipcMain.on(ipcConsts.GET_TOTAL_AWARDS, (event) => {
    netService.getTotalAwards({ event });
  });

  ipcMain.on(ipcConsts.GET_UPCOMING_AWARD, (event) => {
    netService.getUpcomingAward({ event });
  });

  ipcMain.on(ipcConsts.GET_BALANCE, (event, request) => {
    netService.getBalance({ event, ...request });
  });

  ipcMain.on(ipcConsts.GET_NONCE, (event, request) => {
    netService.getNonce({ event, ...request });
  });

  ipcMain.on(ipcConsts.SEND_TX, (event, request) => {
    netService.sendTx({ event, ...request });
  });

  ipcMain.on(ipcConsts.GET_LATEST_VALID_LAYER_ID, (event) => {
    netService.getLatestValidLayerId({ event });
  });

  ipcMain.on(ipcConsts.GET_TX_LIST, (event, request) => {
    netService.getTxList({ event, ...request });
  });
};

export { subscribeToEventListeners }; // eslint-disable-line import/prefer-default-export
