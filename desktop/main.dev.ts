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
import { app, BrowserWindow, BrowserView, ipcMain, Tray, Menu, dialog, nativeTheme, shell } from 'electron';
import 'regenerator-runtime/runtime';
import fetch from 'electron-fetch';

import { ipcConsts } from '../app/vars';
import { PublicService } from '../shared/types';
import { DiscoveryItem } from '../shared/schemas';
import MenuBuilder from './menu';
import AutoStartManager from './autoStartManager';
import StoreService from './storeService';
import WalletManager from './WalletManager';
import NodeManager from './NodeManager';
import NotificationManager from './notificationManager';
import SmesherManager from './SmesherManager';
import './wasm_exec';

require('dotenv').config();

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
const DEBUG = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

DEBUG && require('electron-debug')();

let mainWindow: BrowserWindow;
let browserView: BrowserView;
let tray: Tray;
let nodeManager: NodeManager;
let notificationManager: NotificationManager;
let isDarkMode: boolean = nativeTheme.shouldUseDarkColors;

let closingApp = false;
const isSmeshing = () => {
  const netId = StoreService.get('netSettings.netId');
  return StoreService.get(`${netId}-smeshingParams`);
};
const keepSmeshingInBackground = async () => {
  const { response } = await dialog.showMessageBox(mainWindow, {
    title: 'Quit App',
    message:
      '\nQuitting stops smeshing and may cause loss of future due smeshing rewards.' +
      '\n\n\n• Click RUN IN BACKGROUND to close the App window and to keep smeshing in the background.' +
      '\n\n• Click QUIT to close the app and stop smeshing.\n',
    buttons: ['RUN IN BACKGROUND', 'QUIT', 'Cancel']
  });
  return response === 0;
};
const handleClosingApp = async (event) => {
  if (closingApp) return;
  event.preventDefault();

  if (isSmeshing() && (await keepSmeshingInBackground())) {
    setTimeout(() => {
      notificationManager.showNotification({
        title: 'Spacemesh',
        body: 'Smesher is running in the background.'
      });
    }, 1000);
    mainWindow.hide();
    mainWindow.reload();
  } else {
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

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('close', handleClosingApp);

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

  addIpcEventListeners();

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  const isDevNet = (proc = process): proc is NodeJS.Process & { env: { NODE_ENV: 'development'; DEV_NET_URL: string } } =>
    proc.env.NODE_ENV === 'development' && !!proc.env.DEV_NET_URL;

  interface InitialConfig extends Partial<DiscoveryItem> {
    netID: string;
    netName: string;
    explorer: string;
    dash: string;
    grpcAPI: string;
  }

  const configFilePath = path.resolve(app.getPath('userData'), 'node-config.json');

  const onCleanStart = ({ netID, netName, explorer = '', dash = '' }: InitialConfig, netConfig) => {
    StoreService.clear();
    StoreService.set('netSettings.netId', netID);
    StoreService.set('netSettings.netName', netName);
    StoreService.set('netSettings.explorerUrl', explorer);
    StoreService.set('netSettings.dashUrl', dash);
    StoreService.set('netSettings.minCommitmentSize', parseInt(netConfig.post['post-space']));
    StoreService.set('netSettings.layerDurationSec', netConfig.main['layer-duration-sec']);
    StoreService.set('netSettings.genesisTime', netConfig.main['genesis-time']);
    return writeFileAsync(configFilePath, JSON.stringify(netConfig));
  };
  const isCleanStart = (netId: string) => StoreService.get('netSettings.netId') !== netId;

  const fetchConfigs = async () => {
    if (isDevNet(process)) {
      const netConfig = await fetch(process.env.DEV_NET_URL).then((r) => r.json());
      const initialConfig = {
        netID: netConfig.p2p['network-id'],
        netName: 'Dev Net',
        explorer: '',
        dash: '',
        grpcAPI: process.env.DEV_NET_REMOTE_API || ''
      };
      return { netConfig, initialConfig };
    } else {
      const [initialConfig] = await fetch(DISCOVERY_URL).then((r) => r.json());
      const netConfig = await fetch(initialConfig.conf).then((r) => r.json());
      return { netConfig, initialConfig };
    }
  };

  const toPublicService = (netName: string, url: string) => {
    // Remove `https://` and trailing slash to resolve ip address
    const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const [, port] = cleanUrl.match(/:(\d+)$/) || [null, ''];
    return {
      name: netName,
      ip: port && port.length > 0 ? cleanUrl.slice(0, -(port.length + 1)) : cleanUrl,
      port: port || ''
    };
  };

  const subscribeListingGrpcApis = (initialConfig: InitialConfig) => {
    // TODO: Give a wider list of options
    const walletServices: PublicService[] = [toPublicService(initialConfig.netName, initialConfig.grpcAPI)];
    ipcMain.handle(ipcConsts.LIST_PUBLIC_SERVICES, () => walletServices);
  };

  const { initialConfig, netConfig } = await fetchConfigs();
  const cleanStart = isCleanStart(initialConfig.netID);
  cleanStart && (await onCleanStart(initialConfig, netConfig));
  subscribeListingGrpcApis(initialConfig);

  nodeManager = new NodeManager(mainWindow, configFilePath, cleanStart);
  // eslint-disable-next-line no-new
  new WalletManager(mainWindow, nodeManager);
  // eslint-disable-next-line no-new
  new SmesherManager(mainWindow);
  notificationManager = new NotificationManager(mainWindow);
  new AutoStartManager(); // eslint-disable-line no-new
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
