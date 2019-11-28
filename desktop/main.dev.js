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
import { subscribeToEventListeners } from './eventListners';
import subscribeToAutoUpdateListeners from './autoUpdateListeners';

export default class AppUpdater {
  constructor() {
    autoUpdater.logger = null;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.autoDownload = true;
  }
}

let mainWindow = null;
let tray = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

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
    height: 860,
    minWidth: 1024,
    minHeight: 728,
    center: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // Add event listeners.
  subscribeToEventListeners({ mainWindow });
  subscribeToAutoUpdateListeners({ mainWindow });
};

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
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

  ipcMain.on(ipcConsts.CHECK_APP_VISIBLITY, () =>
    mainWindow.isVisible() && mainWindow.isFocused() ? mainWindow.webContents.send(ipcConsts.APP_VISIBLE) : mainWindow.webContents.send(ipcConsts.APP_HIDDEN)
  );

  ipcMain.on(ipcConsts.QUIT_APP, () => {
    mainWindow.destroy();
    app.quit();
  });

  ipcMain.on(ipcConsts.KEEP_RUNNING_IN_BACKGROUND, () => mainWindow.hide());

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
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
