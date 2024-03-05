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

import pkg from '../package.json';
import AutoStartManager from './AutoStartManager';
import StoreService from './storeService';
import './wasm_exec';
import { isDebug, isProd } from './envModes';
import installDevTools from './main/installDevTools';
import subscribeIPC from './main/subscribeIPC';
import { getDefaultAppContext } from './main/context';
import Wallet from './main/Wallet';
import startApp from './main/startApp';
import { cleanupTmpDir } from './testMode';
import Logger from './logger';

// Ensure that we run only single instance of Smapp
!app.requestSingleInstanceLock() && app.quit();

// Prepare environment
require('dotenv').config();
isDebug() && require('electron-debug')();
isProd() && require('source-map-support').install();

const logger = Logger({ className: 'App' });
logger.log('Started', { version: pkg.version });

// Preload data
StoreService.init();

// State
const context = getDefaultAppContext();

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
  .then(() => AutoStartManager.init())
  .then(() => subscribeIPC(context))
  .then(() => Wallet.subscribe())
  .then(() => {
    cleanupTmpDir();
    context.state = startApp();
    return context.state;
  })
  .catch((error) => {
    logger.error('An error occurred during app initialization', error);
    process.exit(1);
  });
