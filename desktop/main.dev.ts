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
import { app, BrowserWindow, BrowserView, ipcMain, Tray, Menu, dialog, nativeTheme, shell } from 'electron';
import 'regenerator-runtime/runtime';
import fetch from 'electron-fetch';

import { ipcConsts } from '../app/vars';
import { PublicService } from '../shared/types';
import { toPublicService } from '../shared/utils';
import MenuBuilder from './menu';
import AutoStartManager from './autoStartManager';
import StoreService from './storeService';
import WalletManager from './WalletManager';
import NodeManager from './NodeManager';
import NotificationManager from './notificationManager';
import SmesherManager from './SmesherManager';
import './wasm_exec';
import { writeFileAsync } from './utils';

require('dotenv').config();

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
const DEBUG = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

DEBUG && require('electron-debug')();

let mainWindow: BrowserWindow;
let browserView: BrowserView;
let tray: Tray;
let nodeManager: NodeManager;
let smesherManager: SmesherManager;
let notificationManager: NotificationManager;
let isDarkMode: boolean = nativeTheme.shouldUseDarkColors;

let closingApp = false;
let shouldShowWindowOnLoad = true;
const isSmeshing = async () => smesherManager && (await smesherManager.isSmeshing());

enum CloseAppPromptResult {
  CANCELED = 1, // To avoid conversion to `false`
  KEEP_SMESHING = 2,
  CLOSE = 3
}

const promptClosingApp = async () => {
  const { response } = await dialog.showMessageBox(mainWindow, {
    title: 'Quit App',
    message:
      '\nQuitting stops smeshing and may cause loss of future due smeshing rewards.' +
      '\n\n\n• Click RUN IN BACKGROUND to close the App window and to keep smeshing in the background.' +
      '\n\n• Click QUIT to close the app and stop smeshing.\n',
    buttons: ['RUN IN BACKGROUND', 'QUIT', 'Cancel'],
    cancelId: 2
  });
  switch (response) {
    default:
    case 2:
      return CloseAppPromptResult.CANCELED;
    case 0:
      return CloseAppPromptResult.KEEP_SMESHING;
    case 1:
      return CloseAppPromptResult.CLOSE;
  }
};
const handleClosingApp = async (event: Electron.Event) => {
  if (closingApp) return;
  event.preventDefault();

  const promptResult = ((await isSmeshing()) && (await promptClosingApp())) || CloseAppPromptResult.CLOSE;
  if (promptResult === CloseAppPromptResult.KEEP_SMESHING) {
    setTimeout(() => {
      notificationManager.showNotification({
        title: 'Spacemesh',
        body: 'Smesher is running in the background.'
      });
    }, 1000);
    mainWindow.hide();
    shouldShowWindowOnLoad = false;
    mainWindow.reload();
  } else if (promptResult === CloseAppPromptResult.CLOSE) {
    mainWindow.webContents.send(ipcConsts.CLOSING_APP);
    await nodeManager.stopNode();
    closingApp = true;
    app.quit();
  }
};

app.on('before-quit', handleClosingApp);

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
      click: () => app.quit()
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
const isDevNet = (proc = process): proc is NodeJS.Process & { env: { NODE_ENV: 'development'; DEV_NET_URL: string } } =>
  proc.env.NODE_ENV === 'development' && !!proc.env.DEV_NET_URL;

const getInitialConfig = async () => {
  if (isDevNet(process)) {
    return {
      netName: 'Dev Net',
      conf: process.env.DEV_NET_URL,
      explorer: '',
      dash: '',
      grpcAPI: process.env.DEV_NET_REMOTE_API?.split(',')[0] || ''
    };
  }
  const res = await fetch(DISCOVERY_URL);
  const [initialConfig] = await res.json();
  return initialConfig;
};
const getNetConfig = async (configUrl) => {
  const resp = await fetch(configUrl);
  return resp.json();
};
const getConfigs = async () => {
  const initialConfig = await getInitialConfig();
  const netConfig = await getNetConfig(initialConfig.conf);
  const netId = parseInt(initialConfig.netID) || netConfig.p2p['network-id'];
  const savedNetId = StoreService.get('netSettings.netId');
  const isCleanStart = savedNetId !== netId;

  return {
    initialConfig,
    netConfig,
    netId,
    isCleanStart
  };
};

const createWindow = async () => {
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

  mainWindow.on('close', handleClosingApp);

  createTray();

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (shouldShowWindowOnLoad) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  addIpcEventListeners();

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  const configFilePath = path.resolve(app.getPath('userData'), 'node-config.json');

  const { initialConfig, netConfig, isCleanStart, netId } = await getConfigs();

  if (isCleanStart) {
    StoreService.clear();
    StoreService.set('netSettings.netId', netId);
    StoreService.set('netSettings.netName', initialConfig.netName);
    StoreService.set('netSettings.explorerUrl', initialConfig.explorer);
    StoreService.set('netSettings.dashUrl', initialConfig.dash);
    StoreService.set('netSettings.minCommitmentSize', parseInt(netConfig.post['post-space']));
    StoreService.set('netSettings.layerDurationSec', netConfig.main['layer-duration-sec']);
    StoreService.set('netSettings.genesisTime', netConfig.main['genesis-time']);
    StoreService.set('nodeConfigFilePath', configFilePath);

    netConfig.smeshing = {}; // Ensure that the net config does not provide preinstalled defaults for smeshing
    await writeFileAsync(configFilePath, JSON.stringify(netConfig));
  }

  const subscribeListingGrpcApis = (initialConfig) => {
    const walletServices: PublicService[] = [
      toPublicService(initialConfig.netName, initialConfig.grpcAPI),
      ...(isDevNet(process) && process.env.DEV_NET_REMOTE_API
        ? process.env.DEV_NET_REMOTE_API?.split(',')
            .slice(1)
            .map((url) => toPublicService(initialConfig.netName, url))
        : [])
    ];
    ipcMain.handle(ipcConsts.LIST_PUBLIC_SERVICES, () => walletServices);
  };

  smesherManager = new SmesherManager(mainWindow, configFilePath);
  nodeManager = new NodeManager(mainWindow, isCleanStart, smesherManager);
  // eslint-disable-next-line no-new
  new WalletManager(mainWindow, nodeManager);
  notificationManager = new NotificationManager(mainWindow);
  new AutoStartManager(); // eslint-disable-line no-new
  subscribeListingGrpcApis(initialConfig);

  // Load page after initialization complete
  mainWindow.loadURL(`file://${__dirname}/index.html`);
};

const installDevTools = async () => {
  if (!DEBUG) return;
  const { default: installExtension, REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
  await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS], { loadExtensionOptions: { allowFileAccess: true }, forceDownload: false }).then(
    (names) => console.log('DevTools Installed:', names), // eslint-disable-line no-console
    (err) => console.log('DevTools Installation Error:', err) // eslint-disable-line no-console
  );
};

app
  .whenReady()
  .then(() => installDevTools())
  .then(createWindow)
  .catch(console.log); // eslint-disable-line no-console

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  } else if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});
