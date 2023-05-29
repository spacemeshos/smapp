import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  ReplaySubject,
  Subject,
} from 'rxjs';
import Logger from '../logger';
import createTray from './createTray';
import createWindow from './createWindow';
import { fromAppEvent, withLatest } from './rx.utils';

const logger = Logger({ className: 'startApp' });

// Utils
const showWindow = (bw: BrowserWindow) => {
  bw.show();
  bw.focus();
};

export default () => {
  const $mainWindow = new ReplaySubject<BrowserWindow>(1, Infinity);
  const $isWindowReady = new Subject<void>();

  // States
  const $showWindowOnLoad = new BehaviorSubject(true);
  const $isAppClosing = new BehaviorSubject(false);

  // Event streams
  // $quit is not handled in this module, because
  // it requires to check for `isSmeshing`. So
  // it will be solved on the "upper" level.
  const $quit = new Subject<Electron.IpcMainEvent>();
  const $activate = fromAppEvent('activate');
  const $secondInstance = fromAppEvent('second-instance');

  //
  // Subscriptions & Reactions
  //

  // Push to $quit event stream
  const handleQuit = async (event) => {
    if (!$isAppClosing.value) {
      $quit.next(event);
    }
  };

  app.on('before-quit', handleQuit);
  autoUpdater.on('before-quit-for-update', handleQuit);

  // Add handlers to mainWindow
  $mainWindow.subscribe((mw) => {
    createTray(mw);
    mw.on('close', handleQuit);
    mw.webContents.on(
      'did-finish-load',
      async () => (await firstValueFrom($showWindowOnLoad)) && showWindow(mw)
    );
    ipcMain.on('BROWSER_READY', () => $isWindowReady.next());
  });

  // If second instance trying to run — just show the main window
  $secondInstance.pipe(withLatest($mainWindow)).subscribe(([mw]) => {
    mw.isMinimized() && mw.restore();
    showWindow(mw);
  });

  // Show window on activate
  combineLatest([$mainWindow, $activate]).subscribe(([mw]) => showWindow(mw));

  // Create window
  app
    .whenReady()
    .then(createWindow)
    .then((mw) => $mainWindow.next(mw))
    .catch((err) => logger.error('Can not create MainWindow:', err));

  return {
    $mainWindow,
    $quit,
    $isAppClosing,
    $showWindowOnLoad,
    $isWindowReady,
    $isSmappActivated: $activate,
  };
};
