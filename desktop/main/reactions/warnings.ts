import {
  Observable,
  ReplaySubject,
  Subject,
  switchMap,
  take,
  combineLatestWith,
} from 'rxjs';
import { BrowserWindow } from 'electron';
import { ipcConsts } from '../../../app/vars';
import Warning from '../../../shared/warning';
import { makeSubscription } from '../rx.utils';
import { Managers } from '../app.types';

/**
 * Send IPC Event to Renderer process on any new warning
 */
export const sendWarningsToRenderer = (
  $warnings: Subject<Warning>,
  $mainWindow: ReplaySubject<BrowserWindow>,
  $isWindowReady: Subject<void>
) => {
  makeSubscription(
    $warnings.pipe(
      combineLatestWith($mainWindow, $isWindowReady.pipe(take(1)))
    ),
    ([warning, mainWindow, _]) => {
      mainWindow.webContents.send(ipcConsts.NEW_WARNING, warning.toObject());
    }
  );
};

/**
 * Merges warnings from other sources into $warnings
 */
export const collectWarnings = (
  $managers: Observable<Managers>,
  $warnings: Subject<Warning>
) =>
  makeSubscription(
    $managers.pipe(switchMap((managers) => managers.node.$warnings)),
    (warning) => $warnings.next(warning)
  );
