import { BrowserWindow } from 'electron';
import { Subject, withLatestFrom } from 'rxjs';
import promptBeforeClose from '../promptBeforeClose';
import Logger from '../../logger';
import { makeSubscription } from '../rx.utils';
import { Managers } from '../app.types';

const logger = Logger({ className: 'reactions/handleCloseApp' });

export default (
  $quit: Subject<Electron.IpcMainEvent>,
  $managers: Subject<Managers>,
  $mainWindow: Subject<BrowserWindow>,
  $isAppClosing: Subject<boolean>,
  $showWindowOnLoad: Subject<boolean>
) =>
  makeSubscription(
    $quit.pipe(withLatestFrom($mainWindow), withLatestFrom($managers)),
    ([[event, mw], managers]) => {
      mw &&
        promptBeforeClose(
          mw,
          managers || {},
          $isAppClosing,
          $showWindowOnLoad
        )(event).catch((err) => logger.error('promptBeforeClose', err));
    }
  );
