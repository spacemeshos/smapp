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
import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import 'regenerator-runtime/runtime';
import fetch from 'electron-fetch';

import { ipcConsts } from '../app/vars';
import { PublicService } from '../shared/types';
import { stringifySocketAddress, toPublicService } from '../shared/utils';
import MenuBuilder from './menu';
import AutoStartManager from './autoStartManager';
import StoreService from './storeService';
import WalletManager from './WalletManager';
import NodeManager from './NodeManager';
import NotificationManager from './notificationManager';
import SmesherManager from './SmesherManager';
import './wasm_exec';
import { isDebug, isDev, isDevNet, isProd, writeFileAsync } from './utils';
import prompt from './prompt';
import createTray from './main/createTray';
import installDevTools from './main/installDevTools';
import subscribeIPC from './main/subscribeIPC';
import { getDefaultAppContext } from './main/context';
import promptBeforeClose from './main/promptBeforeClose';
import { contextType } from 'react-timeago';

// Ensure that we run only single instance of Smapp
!app.requestSingleInstanceLock() && app.quit();

// Prepare environment
require('dotenv').config();
require('electron-unhandled')();
isDebug() && require('electron-debug')();
isProd() && require('source-map-support').install();

(async function () {
  const filePath = path.resolve(app.getAppPath(), isDev() ? './' : 'desktop/', 'ed25519.wasm');
  const bytes = fs.readFileSync(filePath);
  // const bytes = await response.arrayBuffer();
  // @ts-ignore
  const go = new Go(); // eslint-disable-line no-undef
  const { instance } = await WebAssembly.instantiate(bytes, go.importObject);
  await go.run(instance);
})();

// Preload data
StoreService.init();

// State
const context = getDefaultAppContext();

// App behaviors
const onCloseHandler = promptBeforeClose(context);

// Handlers
const promptNetworkSelection = async (networks) => {
  const options = Object.fromEntries(networks.map((conf, idx) => [idx, `${conf.netName} (${conf.netID})`]));
  const res = await prompt(
    {
      title: 'Spacemesh App: Choose the network',
      label: 'Please, choose the network:',
      type: 'select',
      selectOptions: options,
      alwaysOnTop: true,
    },
    null
  );
  return res ? parseInt(res, 10) : 0;
};

const selectNetwork = async (currentNetId, networks) => {
  if (currentNetId) {
    const currentNetConfig = networks.find((conf) => conf.netID === currentNetId);
    if (currentNetConfig) return currentNetConfig;
  }
  const netIndex = networks.length > 1 ? await promptNetworkSelection(networks) : 0;
  return networks[netIndex];
};

const getInitialConfig = async (savedNetId) => {
  const DISCOVERY_URL = 'https://discover.spacemesh.io/networks.json';
  if (isDevNet(process)) {
    return {
      netName: 'Dev Net',
      conf: process.env.DEV_NET_URL,
      explorer: '',
      dash: '',
      grpcAPI: process.env.DEV_NET_REMOTE_API?.split(',')[0] || '',
    };
  }
  const res = await fetch(DISCOVERY_URL);
  const networks = await res.json();
  return selectNetwork(savedNetId, networks);
};
const getNetConfig = async (configUrl) => {
  const resp = await fetch(configUrl);
  return resp.json();
};
const getConfigs = async () => {
  const savedNetId = StoreService.get('netSettings.netId');
  const initialConfig = await getInitialConfig(savedNetId);
  const netConfig = await getNetConfig(initialConfig.conf);
  const netId = parseInt(initialConfig.netID) || netConfig.p2p['network-id'];
  const isCleanStart = savedNetId !== netId;

  return {
    initialConfig,
    netConfig,
    netId,
    isCleanStart,
  };
};

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 700,
    minWidth: 1100,
    minHeight: 680,
    center: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.on('close', onCloseHandler);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!context.mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (context.showWindowOnLoad) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

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
    const publicApis: PublicService[] = [
      toPublicService(initialConfig.netName, initialConfig.grpcAPI),
      ...(isDevNet(process) && process.env.DEV_NET_REMOTE_API
        ? process.env.DEV_NET_REMOTE_API?.split(',')
            .slice(1)
            .map((url) => toPublicService(initialConfig.netName, url))
        : []),
    ];
    StoreService.set('netSettings.grpcAPI', publicApis.map(stringifySocketAddress));
  };

  const smesherManager = new SmesherManager(mainWindow, configFilePath);
  const nodeManager = new NodeManager(mainWindow, isCleanStart, smesherManager);
  // eslint-disable-next-line no-new
  new WalletManager(mainWindow, nodeManager);
  subscribeListingGrpcApis(initialConfig);

  // Load page after initialization complete
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  context.mainWindow = mainWindow;
  context.managers.smesher = smesherManager;
  context.managers.node = nodeManager;

  return mainWindow;
};

const showMainWindow = () => {
  const { mainWindow } = context;
  if (mainWindow === null) {
    createWindow();
  } else if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
};

// App: subscribe to events
app.on('before-quit', onCloseHandler);
app.on('activate', showMainWindow);
app.on('second-instance', () => {
  if (!mainWindow) return;
  mainWindow.isMinimized() && mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
});

subscribeIPC(context);
new AutoStartManager(); // eslint-disable-line no-new

// Run
app
  .whenReady()
  .then(createTray)
  .then(installDevTools)
  .then(createWindow)
  .catch(console.log); // eslint-disable-line no-console
