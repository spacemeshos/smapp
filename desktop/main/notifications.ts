import {
  Observable,
  ReplaySubject,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { BrowserWindow } from 'electron';
import { ipcConsts } from '../../app/vars';
import Warning from '../../shared/warning';
import { makeSubscription } from './rx.utils';
import { Managers } from './app.types';

export const handleNotifications = (
  $warnings: Subject<Warning>,
  $mainWindow: ReplaySubject<BrowserWindow>
) =>
  makeSubscription(
    $warnings.pipe(withLatestFrom($mainWindow)),
    ([warning, mainWindow]) => {
      mainWindow.webContents.send(ipcConsts.NEW_WARNING, warning.toObject());
    }
  );

export const handleManagersNotifications = (
  $managers: Observable<Managers>,
  $warnings: Subject<string | Error>
) =>
  makeSubscription(
    $managers.pipe(switchMap((managers) => managers.node.$warnings)),
    (notification) => $warnings.next(notification)
  );
