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
import { app } from 'electron';
import 'regenerator-runtime/runtime';

import AutoStartManager from './autoStartManager';
import StoreService from './storeService';
import './wasm_exec';
import { isDebug, isDev, isProd } from './utils';
import createTray from './main/createTray';
import installDevTools from './main/installDevTools';
import subscribeIPC from './main/subscribeIPC';
import { getDefaultAppContext } from './main/context';
import promptBeforeClose from './main/promptBeforeClose';
import createWindow from './main/createWindow';
import Networks from './main/Networks';
import Wallet from './main/Wallet';

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

const showMainWindow = () => {
  const { mainWindow } = context;
  if (mainWindow === null) {
    createWindow(context, onCloseHandler);
  } else if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
};

// App: subscribe to events
app.on('before-quit', onCloseHandler);
app.on('activate', showMainWindow);
app.on('second-instance', () => {
  const { mainWindow } = context;
  if (!mainWindow) return;
  mainWindow.isMinimized() && mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
});

// subscribeManagerConstructors(context);
new AutoStartManager(); // eslint-disable-line no-new

// Run
app
  .whenReady()
  .then(installDevTools)
  .then(() => subscribeIPC(context))
  .then(() => Networks.subscribe(context))
  .then(() => Wallet.subscribe(context))
  .then(() => Networks.update(context))
  .then(() => createTray(context))
  .then(() => createWindow(context, onCloseHandler))
  .catch(console.log); // eslint-disable-line no-console
