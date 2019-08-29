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
import { app, BrowserWindow, dialog, Notification } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
// eslint-disable-next-line import/no-cycle
import { subscribeToEventListeners } from './eventListners';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;
let isMining = false;

export const updateMiningStatus = (isMiningOrInSetup) => {
  isMining = isMiningOrInSetup;
};

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
    center: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // Add event listeners.
  subscribeToEventListeners({ mainWindow });
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

  mainWindow.on('close', (event) => {
    event.preventDefault();
    const options = {
      title: 'Spacemesh',
      message: 'Quit Spacemesh and stop the miner?',
      buttons: ['Keep running in background', 'Quit']
    };

    const closeApp = () => {
      mainWindow.destroy();
      mainWindow = null;
      app.quit();
    };

    const hideAppFromDock = () => {
      if (process.platform === 'darwin') {
        app.dock.hide();
      }
    };

    const notifyMinerIsRunning = () => {
      const notificationOptions: any = {
        title: 'Spacemesh',
        body: 'Miner is running in the background.',
        icon: path.join(__dirname, '..', 'resources', 'icon.png')
      };
      const notification = new Notification(notificationOptions);
      notification.show();
    };

    if (isMining) {
      dialog.showMessageBox(mainWindow, options, (response) => {
        if (response === 0) {
          mainWindow.hide();
          notifyMinerIsRunning();
        }
        if (response === 1) {
          closeApp();
        }
        hideAppFromDock();
      });
    } else {
      closeApp();
      hideAppFromDock();
    }
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
  } else if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});
