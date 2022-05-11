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
import { init, captureException } from '@sentry/electron';
import 'regenerator-runtime/runtime';
import { BrowserTracing } from '@sentry/tracing';
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
import * as autoUpdate from './main/autoUpdate';
import IpcSyncMain from './ipcSync';

// Ensure that we run only single instance of Smapp
!app.requestSingleInstanceLock() && app.quit();

// Prepare environment
require('dotenv').config();
isDebug() && require('electron-debug')();
isProd() && require('source-map-support').install();

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  debug: process.env.SENTRY_LOG_LEVEL === 'debug',
  environment: process.env.SENTRY_ENV || process.env.NODE_ENV,
  enabled: process.env.NODE_ENV !== 'development',
  maxValueLength: 20000,
  attachStacktrace: true,
});

(async function () {
  const filePath = path.resolve(
    app.getAppPath(),
    isDev() ? './' : 'desktop/',
    'ed25519.wasm'
  );
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
  .then(() => createTray(context))
  .then(() => createWindow(context, onCloseHandler))
  .then(() => Networks.update(context, 1))
  .then(() => autoUpdate.subscribe(context))
  .then(() => {
    const updateRendererStore = IpcSyncMain(
      'config',
      () => context.mainWindow,
      (state) => ({ node: state.node })
    );
    // Delay to ensure that redux is completely started up
    setTimeout(() => {
      // Send initial values
      updateRendererStore(StoreService.dump());
      // Subscribe on changes
      StoreService.onChange((n, p) => n !== p && updateRendererStore(n));
    }, 5000);
    return 0;
  })
  .catch(captureException);
