import { BrowserWindow } from 'electron';
import { Subject, withLatestFrom } from 'rxjs';
import { Managers } from '../Networks';
import promptBeforeClose from '../promptBeforeClose';
import Logger from '../../logger';
import { wrapFlow } from '../rx.utils';

const logger = Logger({ className: 'reactions/handleCloseApp' });

export default (
  $quit: Subject<Electron.IpcMainEvent>,
  $managers: Subject<Managers>,
  $mainWindow: Subject<BrowserWindow>,
  $isAppClosing: Subject<boolean>,
  $showWindowOnLoad: Subject<boolean>
) =>
  wrapFlow(
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
