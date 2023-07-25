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

import { app } from 'electron';
import 'regenerator-runtime/runtime';
import AutoStartManager from './AutoStartManager';
import StoreService from './storeService';
import './wasm_exec';
import { isDebug, isProd } from './utils';
import installDevTools from './main/installDevTools';
import subscribeIPC from './main/subscribeIPC';
import { getDefaultAppContext } from './main/context';
import Wallet from './main/Wallet';
import startApp from './main/startApp';
import { init, captureMainException } from './sentry';
import { cleanupTmpDir } from './testMode';

// Ensure that we run only single instance of Smapp
!app.requestSingleInstanceLock() && app.quit();

// Prepare environment
require('dotenv').config();
isDebug() && require('electron-debug')();
isProd() && require('source-map-support').install();

// Preload data
StoreService.init();

// State
const context = getDefaultAppContext();

init();

// Check arguments
if (
  app.commandLine.hasSwitch('discovery') &&
  app.commandLine.getSwitchValue('discovery') === ''
) {
  process.stderr.write(
    'Wrong discovery flag. Use: `spacemesh --discovery=http...`'
  );
  process.exit(1);
}

// Run
app
  .whenReady()
  .then(installDevTools)
  .then(() => new AutoStartManager())
  .then(() => subscribeIPC(context))
  .then(() => Wallet.subscribe())
  .then(() => {
    cleanupTmpDir();
    context.state = startApp();
    return context.state;
  })
  .catch(captureMainException);
