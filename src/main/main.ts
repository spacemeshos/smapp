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
import '../shared/config';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import 'regenerator-runtime/runtime';
import Bech32 from '@spacemesh/address-wasm';
import HRP from '../shared/hrp';
import sentry, { captureException } from '../sentry/main';

// import sentry, { captureException } from '../configs/sentry/main';
import AutoStartManager from './AutoStartManager';
import StoreService from './storeService';
import '../external/wasm_exec';
import { /* addNodeLogFile, */ isDebug, isDev, isProd } from './utils';
// import installDevTools from './main/installDevTools';
import subscribeIPC from './main/subscribeIPC';
import { getDefaultAppContext } from './main/context';
import Wallet from './main/Wallet';
import startApp from './main/startApp';

// Ensure that we run only single instance of Smapp
!app.requestSingleInstanceLock() && app.quit();

isDebug() && require('electron-debug')();
isProd() && require('source-map-support').install();
sentry();

/*

app.setPath('userData', '/Users/max/Library/Application Support/Electron');
init({
  dsn: process.env.SENTRY_DSN,
  release: '0.2.9',
  environment: 'development',
  // attachStacktrace: true,
  // attachScreenshot: true,
  // tracesSampleRate: 1.0,
  // release: '0.2.9',
  // debug: true,
  // environment: 'development',
  // enabled: true,
  /!* integrations: [
    new Integrations.AdditionalContext({
      cpu: true,
      screen: true,
      memory: true,
      language: true,
    }),
    new Integrations.ElectronMinidump(),
  ],
  tracesSampleRate: isProd() ? 1.0 : 1.0,
  debug: true,
  environment: 'development',
  enabled: true,
  maxValueLength: 20000,
  attachStacktrace: true,
  attachScreenshot: true,
  beforeSend: (event, hint) => {
    console.log('Before send');
    /!* const attachment = await addNodeLogFile();
    console.log(attachment.genesisID);
    hint.attachments = [
      { filename: `log-${attachment.genesisID}.txt`, data: attachment.content },
    ];
    console.log('here'); *!/
    return event;
  },
  ignoreErrors: [
    '14 UNAVAILABLE: No connection established',
    'eventFromUnknownInput',
  ], *!/
  /!* transportOptions: {
    // The maximum number of days to keep an event in the queue.
    maxQueueAgeDays: 30,
    // The maximum number of events to keep in the queue.
    maxQueueCount: 30,
    // Called before attempting to send an event to Sentry. Used to override queuing behavior.
    //
    // Return 'send' to attempt to send the event.
    // Return 'queue' to queue and persist the event for sending later.
    // Return 'drop' to drop the event.
    // beforeSend: () => (isOnline() ? 'send' : 'queue'),
  }, *!/
});
*/

(async function () {
  const filePath = path.resolve(app.getAppPath(), 'src/external/ed25519.wasm');
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

const result = captureException(new Error('Node error'));
console.log({ result });

// Run
app
  .whenReady()
  .then(() => new AutoStartManager())
  .then(() => subscribeIPC(context))
  .then(() => Wallet.subscribe(context))
  .then(() => {
    context.state = startApp();
    return context.state;
  })
  .catch((e) => console.error(e));
