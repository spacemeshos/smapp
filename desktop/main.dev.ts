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
import 'json-bigint-patch';

import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import 'regenerator-runtime/runtime';
import Bech32 from '@spacemesh/address-wasm';
import HRP from '../shared/hrp';
import AutoStartManager from './AutoStartManager';
import StoreService from './storeService';
import './wasm_exec';
import { isDebug, isDev, isProd } from './utils';
import installDevTools from './main/installDevTools';
import subscribeIPC from './main/subscribeIPC';
import { getDefaultAppContext } from './main/context';
import Wallet from './main/Wallet';
import startApp from './main/startApp';
import { init, captureMainException } from './sentry';

// Ensure that we run only single instance of Smapp
!app.requestSingleInstanceLock() && app.quit();

// Prepare environment
require('dotenv').config();
isDebug() && require('electron-debug')();
isProd() && require('source-map-support').install();

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

// TODO: Set HRP Network by retrieving it from some config?
Bech32.setHRPNetwork(HRP.TestNet);

init();

// Run
app
  .whenReady()
  .then(installDevTools)
  .then(() => new AutoStartManager())
  .then(() => subscribeIPC(context))
  .then(() => Wallet.subscribe(context))
  .then(() => {
    context.state = startApp();
    return context.state;
  })
  .catch(captureMainException);
