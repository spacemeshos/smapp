/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./desktop/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import path from 'path';
import fs from 'fs';
import util from 'util';
import os from 'os';
import { app, BrowserWindow, BrowserView, ipcMain, Tray, Menu, dialog, nativeTheme, shell, session } from 'electron';
import 'regenerator-runtime/runtime';
// import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import fetch from 'electron-fetch';

import { ipcConsts } from '../app/vars';
import MenuBuilder from './menu';
import AutoStartManager from './autoStartManager';
import StoreService from './storeService';
import WalletManager from './WalletManager';
import NodeManager from './NodeManager';
import NotificationManager from './notificationManager';
import SmesherManager from './SmesherManager';
import './wasm_exec';

const writeFileAsync = util.promisify(fs.writeFile);

const DISCOVERY_URL = 'https://discover.spacemesh.io/networks.json';

(async function () {
  const filePath = path.resolve(app.getAppPath(), process.env.NODE_ENV === 'development' ? './' : 'desktop/', 'ed25519.wasm');
  const bytes = fs.readFileSync(filePath);
  // const bytes = await response.arrayBuffer();
  // @ts-ignore
  const go = new Go(); // eslint-disable-line no-undef
  const { instance } = await WebAssembly.instantiate(bytes, go.importObject);
  await go.run(instance);
})();

const unhandled = require('electron-unhandled');

unhandled();

StoreService.init();

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

let mainWindow: BrowserWindow;
let browserView: BrowserView;
let tray: Tray;
let nodeManager: NodeManager;
let notificationManager: NotificationManager;
let isDarkMode: boolean = nativeTheme.shouldUseDarkColors;

const handleClosingApp = async () => {
  const netId = StoreService.get('netSettings.netId');
  const isSmeshing = StoreService.get(`${netId}-smeshingParams`);
  if (isSmeshing) {
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
      setTimeout(() => {
        notificationManager.showNotification({
          title: 'Spacemesh',
          body: 'Smesher is running in the background.'
        });
      }, 1000);
      mainWindow.hide();
      mainWindow.reload();
    } else if (response === 1) {
      await nodeManager.stopNode({ browserWindow: mainWindow, isDarkMode });
      mainWindow.destroy();
      app.quit();
    }
  } else {
    const isRunningLocalNode = StoreService.get('localNode');
    if (isRunningLocalNode) {
      await nodeManager.stopNode({ browserWindow: mainWindow, isDarkMode });
    }
    mainWindow.destroy();
    app.quit();
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

const createBrowserView = () => {
  browserView = new BrowserView({
    webPreferences: {
      nodeIntegration: false
    }
  });
};

const addIpcEventListeners = () => {
  ipcMain.handle(ipcConsts.GET_OS_THEME_COLOR, () => nativeTheme.shouldUseDarkColors);

  ipcMain.on(ipcConsts.OPEN_BROWSER_VIEW, () => {
    createBrowserView();
    mainWindow.setBrowserView(browserView);
    browserView.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });
    const contentBounds = mainWindow.getContentBounds();
    browserView.setBounds({ x: 0, y: 90, width: contentBounds.width - 35, height: 600 });
    browserView.setAutoResize({ width: true, height: true, horizontal: true, vertical: true });
    const dashUrl = StoreService.get('netSettings.dashUrl');
    browserView.webContents.loadURL(`${dashUrl}?hide-right-line${isDarkMode ? '&darkMode' : ''}`);
  });

  ipcMain.on(ipcConsts.DESTROY_BROWSER_VIEW, () => {
    browserView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    // browserView.destroy();
  });

  ipcMain.on(ipcConsts.SEND_THEME_COLOR, (_event, request) => {
    isDarkMode = request.isDarkMode;
  });

  ipcMain.on(ipcConsts.PRINT, (_event, request: { content: string }) => {
    const printerWindow = new BrowserWindow({ width: 800, height: 800, show: true, webPreferences: { nodeIntegration: true, devTools: false } });
    const html = `<body>${request.content}</body><script>window.onafterprint = () => setTimeout(window.close, 3000); window.print();</script>`;
    printerWindow.loadURL(`data:text/html;charset=utf-8,${encodeURI(html)}`);
  });

  ipcMain.on(ipcConsts.RELOAD_APP, () => {
    mainWindow.reload();
  });
};

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

const createWindow = async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    // installExtension(REACT_DEVELOPER_TOOLS).catch((err) => console.log('An error occurred: ', err)); // eslint-disable-line no-console
    // installExtension(REDUX_DEVTOOLS).catch((err) => console.log('An error occurred: ', err)); // eslint-disable-line no-console
    await session.defaultSession.loadExtension(path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.13.5_0'), {
      allowFileAccess: true
    });
    await session.defaultSession.loadExtension(path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.2_1'), {
      allowFileAccess: true
    });
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 700,
    minWidth: 1100,
    minHeight: 680,
    center: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  createTray();

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
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

  addIpcEventListeners();

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  const res = await fetch(DISCOVERY_URL);
  const initialConfig = (await res.json())[0];
  const savedNetId = StoreService.get('netSettings.netId');
  const cleanStart = savedNetId !== initialConfig.netID;
  const configFilePath = path.resolve(app.getAppPath(), process.env.NODE_ENV === 'development' ? './' : '../../config', 'config.json');
  if (cleanStart) {
    StoreService.clear();
    StoreService.set('netSettings.netId', initialConfig.netID);
    StoreService.set('netSettings.netName', initialConfig.netName);
    StoreService.set('netSettings.explorerUrl', initialConfig.explorer);
    StoreService.set('netSettings.dashUrl', initialConfig.dash);
    const res2 = await fetch(initialConfig.conf);
    const netConfig = await res2.json();
    StoreService.set('netSettings.minCommitmentSize', parseInt(netConfig.post['post-space']));
    StoreService.set('netSettings.layerDurationSec', parseInt(netConfig.main['layer-duration-sec']));
    StoreService.set('netSettings.genesisTime', netConfig.main['genesis-time']);
    await writeFileAsync(configFilePath, JSON.stringify(netConfig));
  }

  nodeManager = new NodeManager(mainWindow, configFilePath, cleanStart);
  // eslint-disable-next-line no-new
  new WalletManager(mainWindow, nodeManager);
  // eslint-disable-next-line no-new
  new SmesherManager(mainWindow);
  notificationManager = new NotificationManager(mainWindow);
  new AutoStartManager(); // eslint-disable-line no-new
};

// eslint-disable-next-line no-console
app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  } else if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});
