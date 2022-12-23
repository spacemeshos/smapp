import os from 'os';
import { exec } from 'child_process';
import { app, BrowserWindow, dialog } from 'electron';
import { BehaviorSubject, Subject, withLatestFrom } from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import StoreService from '../../storeService';
import { fromIPC } from '../rx.utils';
import Logger from '../../logger';
import { DEFAULT_WALLETS_DIRECTORY } from '../constants';

const logger = Logger({ className: 'reactions/wipeOut.ipc' });

const wipeOut = async (mainWindow: BrowserWindow) => {
  if (!mainWindow) return false;
  const options = {
    type: 'warning',
    title: 'Reinstall App',
    message:
      'WARNING: All wallets, addresses and settings will be lost. Are you sure you want to do this?',
    buttons: ['Delete All', 'Cancel'],
  };
  const { response } = await dialog.showMessageBox(mainWindow, options);

  if (response === 0) {
    StoreService.clear();
    const command =
      os.type() === 'Windows_NT'
        ? `rmdir /q/s '${DEFAULT_WALLETS_DIRECTORY}'`
        : `rm -rf '${DEFAULT_WALLETS_DIRECTORY}'`;
    exec(command, (error: any) => {
      if (error) {
        logger.error('ipcMain wipeOut', error);
      }
    });
    return true;
  }
  return false;
};

const handleWipeOut = (
  $mainWindow: Subject<BrowserWindow>,
  $isAppClosing: BehaviorSubject<boolean>
) => {
  const $wipeOut = fromIPC<void>(ipcConsts.W_M_WIPE_OUT);
  const $s = $wipeOut.pipe(withLatestFrom($mainWindow));
  const sub = $s.subscribe(async ([_, mainWindow]) => {
    if (await wipeOut(mainWindow)) {
      $isAppClosing.next(true);
      app.quit();
    }
  });
  return sub;
};

export default handleWipeOut;
