import {
  Observable,
  ReplaySubject,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { BrowserWindow } from 'electron';
import { ipcConsts } from '../../app/vars';
import { FilePermissionError } from '../errors';
import { makeSubscription } from './rx.utils';
import { Managers } from './app.types';

export const handleNotifications = (
  $notifications: Subject<string | Error>,
  $mainWindow: ReplaySubject<BrowserWindow>
) =>
  makeSubscription(
    $notifications.pipe(withLatestFrom($mainWindow)),
    ([message, mainWindow]) => {
      if (message instanceof FilePermissionError) {
        mainWindow.webContents.send(
          ipcConsts.FILE_PERMISSION_ERROR,
          message.message
        );
      }
    }
  );

export const handleManagersNotifications = (
  $managers: Observable<Managers>,
  $notifications: Subject<string | Error>
) =>
  makeSubscription(
    $managers.pipe(switchMap((managers) => managers.node.$notifications)),
    (notification) => $notifications.next(notification)
  );
