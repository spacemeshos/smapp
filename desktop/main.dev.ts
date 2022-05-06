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
import installDevTools from './main/installDevTools';
import subscribeIPC from './main/subscribeIPC';
import { getDefaultAppContext } from './main/context';
import Networks from './main/Networks';
import Wallet from './main/Wallet';
import * as autoUpdate from './main/autoUpdate';
import createStore from './main/createStore';

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
new AutoStartManager(); // eslint-disable-line no-new

// Run
app
  .whenReady()
  .then(installDevTools)
  .then(() => subscribeIPC(context))
  .then(() => Networks.subscribe(context))
  .then(() => Wallet.subscribe(context))
  .then(() => {
    const store = createStore();
    context.store = store;
    return context.store;
  })
  .then(() => Networks.update(context, 1))
  .then(() => autoUpdate.subscribe(context))
  .catch(captureException);
