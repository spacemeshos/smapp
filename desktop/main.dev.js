/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./desktop/main.prod.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import { ipcConsts } from '../app/vars';
import MenuBuilder from './menu';
import subscribeToAutoUpdateListeners from './autoUpdateListeners';
import AutoStartManager from './autoStartManager';
import StoreService from './storeService';
import NodeManager from './nodeManager';
import WalletManager from './walletManager';

const debug = require('electron-debug');
const unhandled = require('electron-unhandled');

unhandled();

StoreService.init();
AutoStartManager.init();

class AppUpdater {
  constructor() {
    autoUpdater.logger = null;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.autoDownload = true;
  }
}

let mainWindow = null;
let tray = null;

const installExtensions = () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(extensions.map((name) => installer.default(installer[name], forceDownload))).catch(console.error); // eslint-disable-line no-console
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const createTray = () => {
  tray = new Tray(path.join(__dirname, '..', 'resources', 'icons', '16x16.png'));
  tray.setToolTip('Spacemesh');
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: 'Quit',
      click: () => {
        mainWindow.webContents.send(ipcConsts.REQUEST_CLOSE);
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 800,
    center: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  new NodeManager(mainWindow); // eslint-disable-line no-new
  new WalletManager(mainWindow); // eslint-disable-line no-new
  // Add event listeners.
  subscribeToAutoUpdateListeners({ mainWindow });
};

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    debug();
    await installExtensions();
  }

  createTray();
  createWindow();

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.webContents.send(ipcConsts.REQUEST_CLOSE);
  });

  ipcMain.on(ipcConsts.CHECK_APP_VISIBILITY, () => mainWindow.webContents.send(ipcConsts.IS_APP_VISIBLE, mainWindow.isVisible() && mainWindow.isFocused()));

  ipcMain.on(ipcConsts.KEEP_RUNNING_IN_BACKGROUND, () => {
    mainWindow.hide();
    mainWindow.reload();
  });

  ipcMain.on(ipcConsts.GET_AUDIO_PATH, (event) => {
    const audioPath = path.resolve(app.getAppPath(), process.env.NODE_ENV === 'development' ? '../resources/sounds' : '../../sounds', 'smesh_reward.mp3');
    event.sender.send(ipcConsts.GET_AUDIO_PATH_RESPONSE, { error: null, audioPath });
  });

  ipcMain.on(ipcConsts.PRINT, (event, request: { content: string }) => {
    const printerWindow = new BrowserWindow({ width: 800, height: 800, show: true, webPreferences: { nodeIntegration: true, devTools: false } });
    const html = `<body>${request.content}</body><script>window.onafterprint = () => setTimeout(window.close, 3000); window.print();</script>`;
    printerWindow.loadURL(`data:text/html;charset=utf-8,${encodeURI(html)}`);
  });

  ipcMain.on(ipcConsts.NOTIFICATION_CLICK, () => {
    mainWindow.show();
    mainWindow.focus();
  });

  ipcMain.on(ipcConsts.TOGGLE_AUTO_START, () => {
    AutoStartManager.toggleAutoStart();
  });

  ipcMain.on(ipcConsts.IS_AUTO_START_ENABLED_REQUEST_RESPONSE, (event) => {
    AutoStartManager.isEnabled({ event });
  });

  ipcMain.on(ipcConsts.HARD_REFRESH, () => {
    mainWindow.reload();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // eslint-disable-next-line no-new
  new AppUpdater();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  } else if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});
