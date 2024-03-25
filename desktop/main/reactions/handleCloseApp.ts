import { BrowserWindow } from 'electron';
import { BehaviorSubject, Subject, withLatestFrom } from 'rxjs';
import promptBeforeClose from '../promptBeforeClose';
import Logger from '../../logger';
import { makeSubscription } from '../rx.utils';
import { Managers } from '../app.types';

const logger = Logger({ className: 'reactions/handleCloseApp' });

export default (
  $quit: Subject<Electron.IpcMainEvent>,
  $managers: Subject<Managers>,
  $mainWindow: Subject<BrowserWindow>,
  $isAppClosing: BehaviorSubject<boolean>,
  $showWindowOnLoad: Subject<boolean>,
  $isUpdateInProgress: BehaviorSubject<boolean>
) =>
  makeSubscription(
    $quit.pipe(withLatestFrom($mainWindow, $managers)),
    ([event, mw, managers]) =>
      mw &&
      promptBeforeClose(
        mw,
        managers || {},
        $isAppClosing,
        $showWindowOnLoad,
        $isUpdateInProgress
      )(event).catch((err) => logger.error('promptBeforeClose', err))
  );
