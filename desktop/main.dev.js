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
import { app, BrowserWindow, ipcMain, Tray, Menu, dialog } from 'electron';

import { ipcConsts } from '../app/vars';
import MenuBuilder from './menu';
import UpdateManager from './updateManager';
import AutoStartManager from './autoStartManager';
import StoreService from './storeService';
import NodeManager from './nodeManager';
import WalletManager from './walletManager';

const debug = require('electron-debug');
const unhandled = require('electron-unhandled');

unhandled();

StoreService.init();

let mainWindow = null;
let tray = null;
let nodeManager;

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

  mainWindow.on('close', async (event) => {
    event.preventDefault();
    const savedMiningParams = StoreService.get({ key: 'miningParams' });
    if (savedMiningParams) {
      const options = {
        title: 'Quit App',
        message:
          'Quitting stops smeshing and may cause loss of future due smeshing rewards.' +
          '\n• Click RUN IN BACKGROUND to close the App window and to keep smeshing in the background.' +
          '\n• Click QUIT to close the app and stop smeshing.',
        buttons: ['RUN IN BACKGROUND', 'QUIT', 'Cancel']
      };
      const { response } = await dialog.showMessageBox(mainWindow, options);
      if (response === 0) {
        mainWindow.webContents.send(ipcConsts.KEEP_RUNNING_IN_BACKGROUND);
        mainWindow.hide();
        mainWindow.reload();
      } else if (response === 1) {
        mainWindow.webContents.send(ipcConsts.CLOSING_APP);
        await nodeManager.stopNode({ browserWindow: mainWindow });
      }
    } else {
      mainWindow.webContents.send(ipcConsts.CLOSING_APP);
      await nodeManager.stopNode({ browserWindow: mainWindow });
    }
  });

  ipcMain.handle(ipcConsts.IS_APP_VISIBLE, () => mainWindow.isVisible() && mainWindow.isFocused());

  ipcMain.handle(ipcConsts.GET_AUDIO_PATH, () =>
    path.resolve(app.getAppPath(), process.env.NODE_ENV === 'development' ? '../resources/sounds' : '../../sounds', 'smesh_reward.mp3')
  );

  ipcMain.on(ipcConsts.PRINT, (event, request: { content: string }) => {
    const printerWindow = new BrowserWindow({ width: 800, height: 800, show: true, webPreferences: { nodeIntegration: true, devTools: false } });
    const html = `<body>${request.content}</body><script>window.onafterprint = () => setTimeout(window.close, 3000); window.print();</script>`;
    printerWindow.loadURL(`data:text/html;charset=utf-8,${encodeURI(html)}`);
  });

  ipcMain.on(ipcConsts.NOTIFICATION_CLICK, () => {
    mainWindow.show();
    mainWindow.focus();
  });

  ipcMain.on(ipcConsts.HARD_REFRESH, () => {
    mainWindow.reload();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  nodeManager = new NodeManager(mainWindow);
  new WalletManager(mainWindow); // eslint-disable-line no-new
  new AutoStartManager(); // eslint-disable-line no-new
  new UpdateManager(mainWindow); // eslint-disable-line no-new
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  } else if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});
