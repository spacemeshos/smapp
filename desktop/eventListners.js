import { BrowserWindow, ipcMain } from 'electron';
import { ipcConsts } from '../app/vars';
import FileManager from './fileManager';
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

  ipcMain.on(ipcConsts.GET_DRIVE_LIST, (event) => {
    DiskStorageManager.getDriveList({ event });
  });

  ipcMain.on(ipcConsts.GET_BALANCE, async (event, request) => {
    netService.getBalance({ event, ...request });
  });

  ipcMain.on(ipcConsts.GET_NONCE, async (event, request) => {
    netService.getNonce({ event, ...request });
  });

  ipcMain.on(ipcConsts.SEND_TX, async (event, request) => {
    netService.sendTx({ event, ...request });
  });

  ipcMain.on(ipcConsts.PRINT, (event, request: { content: string }) => {
    const printerWindow = new BrowserWindow({ width: 800, height: 800, show: false, webPreferences: { devTools: false } });
    printerWindow.loadURL(`file://${__dirname}/printer.html`);
    printerWindow.webContents.on('did-finish-load', () => {
      printerWindow.webContents.send('LOAD_CONTENT_AND_PRINT', { content: request.content });
    });
  });

  ipcMain.on(ipcConsts.GET_TOTAL_AWARDS, async (event) => {
    netService.getTotalAwards({ event });
  });

  ipcMain.on(ipcConsts.GET_UPCOMING_AWARD, async (event) => {
    netService.getUpcomingAward({ event });
  });

  ipcMain.on(ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY, async (event, request) => {
    FileManager.openWalletBackupDirectory({ event, ...request });
  });

  ipcMain.on(ipcConsts.START_MINING, async (event, request) => {
    await netService.startMining({ event, ...request });
  });

  ipcMain.on(ipcConsts.SET_AWARDS_ADDRESS, async (event, request) => {
    netService.setAwardsAddress({ event, ...request });
  });

  ipcMain.on(ipcConsts.CHECK_NODE_CONNECTION, async (event) => {
    netService.checkNetworkConnection({ event });
  });

  ipcMain.on(ipcConsts.SET_NODE_IP, async (event, request) => {
    netService.setNodeIpAddress({ event, ...request });
  });

  ipcMain.on(ipcConsts.NOTIFICATION_CLICK, () => {
    mainWindow.show();
    mainWindow.focus();
  });

  ipcMain.on(ipcConsts.CAN_NOTIFY, (event) => {
    const isInFocus = mainWindow.isFocused();
    event.sender.send(ipcConsts.CAN_NOTIFY_SUCCESS, isInFocus);
  });

  ipcMain.on(ipcConsts.DELETE_FILE, async (event, request) => {
    FileManager.deleteWalletFile({ browserWindow: mainWindow, ...request });
  });

  ipcMain.on(ipcConsts.TOGGLE_AUTO_START, async () => {
    WalletAutoStarter.toggleAutoStart();
  });

  ipcMain.on(ipcConsts.IS_AUTO_START_ENABLED_REQUEST_RESPONSE, async (event) => {
    WalletAutoStarter.isEnabled({ event });
  });
};

export { subscribeToEventListeners }; // eslint-disable-line import/prefer-default-export
