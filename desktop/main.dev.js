/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./desktop/main.prod.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { ipcConsts } from '../app/vars';
import MenuBuilder from './menu';
import FileManager from './fileManager';
import DiskStorageManager from './diskStorageManager';
import netService from './netService';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(extensions.map((name) => installer.default(installer[name], forceDownload))).catch(console.error); // eslint-disable-line no-console
};

/**
 * Add event listeners.
 */
ipcMain.on(ipcConsts.READ_FILE, async (event, request) => {
  FileManager.readFile({ event, ...request });
});

ipcMain.on(ipcConsts.GET_FILE_NAME, async (event, request) => {
  FileManager.getFileName({ browserWindow: mainWindow, event, ...request });
});

ipcMain.on(ipcConsts.READ_DIRECTORY, async (event) => {
  FileManager.readDirectory({ browserWindow: mainWindow, event });
});

ipcMain.on(ipcConsts.SAVE_FILE, async (event, request) => {
  FileManager.writeFile({ browserWindow: mainWindow, event, ...request });
});

ipcMain.on(ipcConsts.UPDATE_FILE, async (event, request) => {
  FileManager.updateFile({ event, ...request });
});

ipcMain.on(ipcConsts.GET_DRIVE_LIST, (event) => {
  DiskStorageManager.getDriveList({ event });
});

ipcMain.on(ipcConsts.GET_AVAILABLE_DISK_SPACE, async (event, request) => {
  DiskStorageManager.getAvailableSpace({ event, ...request });
});

ipcMain.on(ipcConsts.GET_BALANCE, async (event, request) => {
  netService.getBalance({ event, ...request });
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

ipcMain.on(ipcConsts.GET_INIT_PROGRESS, async (event) => {
  netService.getLocalNodeSetupProgress({ event });
});

ipcMain.on(ipcConsts.GET_TOTAL_EARNINGS, async (event) => {
  netService.getTotalEarnings({ event });
});

ipcMain.on(ipcConsts.GET_UPCOMING_EARNINGS, async (event) => {
  netService.getUpcomingEarnings({ event });
});

ipcMain.on(ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY, async (event) => {
  FileManager.openWalletBackupDirectory({ event });
});

ipcMain.on(ipcConsts.SET_COMMITMENT_SIZE, async (event, request) => {
  netService.setCommitmentSize({ event, ...request });
});

ipcMain.on(ipcConsts.SET_LOGICAL_DRIVE, async (event, request) => {
  netService.setLogicalDrive({ event, ...request });
});

ipcMain.on(ipcConsts.SET_AWARDS_ADDRESS, async (event, request) => {
  netService.setAwardsAddress({ event, ...request });
});

ipcMain.on(ipcConsts.CHECK_NETWORK_CONNECTION, async (event) => {
  netService.checkNetworkConnection({ event });
});

ipcMain.on(ipcConsts.SET_NODE_IP, async (event, request) => {
  netService.setNodeIpAddress({ event, ...request });
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const createWindow = () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 860,
    minWidth: 1024,
    minHeight: 728,
    center: true
  });
};

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  createWindow();

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
