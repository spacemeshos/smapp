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
import fs from 'fs';
import { app, BrowserWindow, BrowserView, ipcMain, Tray, Menu, dialog, nativeTheme } from 'electron';
import 'regenerator-runtime/runtime';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';

import { ipcConsts } from '../app/vars';
import MenuBuilder from './menu';
import AutoStartManager from './autoStartManager';
import StoreService from './storeService';
import NodeManager from './nodeManager';
import './wasm_exec';

(async function () {
  const filePath = path.resolve(app.getAppPath(), process.env.NODE_ENV === 'development' ? './' : 'desktop/', 'ed25519.wasm');
  const bytes = fs.readFileSync(filePath);
  // const bytes = await response.arrayBuffer();
  const go = new Go(); // eslint-disable-line no-undef
  const { instance } = await WebAssembly.instantiate(bytes, go.importObject);
  await go.run(instance);
})();

const unhandled = require('electron-unhandled');

unhandled();

StoreService.init();

let mainWindow = null;
let browserView = null;
let tray = null;
let nodeManager;

const handleClosingApp = async () => {
  const networkId = StoreService.get({ key: 'networkId' });
  const savedMiningParams = StoreService.get({ key: `${networkId}-miningParams` });
  if (savedMiningParams) {
    const options = {
      title: 'Quit App',
      message:
        '\nQuitting stops smeshing and may cause loss of future due smeshing rewards.' +
        '\n\n\n• Click RUN IN BACKGROUND to close the App window and to keep smeshing in the background.' +
        '\n\n• Click QUIT to close the app and stop smeshing.\n',
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
  const eventHandler = () => {
    mainWindow.show();
    mainWindow.focus();
  };
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => eventHandler()
    },
    {
      label: 'Quit',
      click: async () => {
        await handleClosingApp();
      }
    }
  ]);
  tray.on('double-click', () => eventHandler());
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

const createBrowserView = () => {
  browserView = new BrowserView({
    webPreferences: {
      nodeIntegration: false
    }
  });
};

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    installExtension(REACT_DEVELOPER_TOOLS).catch((err) => console.log('An error occurred: ', err)); // eslint-disable-line no-console
    installExtension(REDUX_DEVTOOLS).catch((err) => console.log('An error occurred: ', err)); // eslint-disable-line no-console
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
    await handleClosingApp();
  });

  ipcMain.handle(ipcConsts.IS_APP_MINIMIZED, () => mainWindow.isMinimized());

  ipcMain.handle(ipcConsts.GET_OS_THEME_COLOR, () => nativeTheme.shouldUseDarkColors);

  ipcMain.handle(ipcConsts.OPEN_BROWSER_VIEW, () => {
    createBrowserView();
    mainWindow.setBrowserView(browserView);
    browserView.setBounds({ x: 0, y: 100, width: 1280, height: 600 });
    browserView.setAutoResize({ width: true, height: true, horizontal: true, vertical: true });
    return browserView.webContents.loadURL('https://stage-dash.spacemesh.io/?hide-right-line');
  });

  ipcMain.handle(ipcConsts.DESTROY_BROWSER_VIEW, () => browserView.destroy());

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

  ipcMain.on(ipcConsts.RELOAD_APP, () => {
    mainWindow.reload();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  nodeManager = new NodeManager(mainWindow);
  new AutoStartManager(); // eslint-disable-line no-new
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  } else if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});
