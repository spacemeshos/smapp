import fs from 'fs/promises';
import { BrowserWindow, dialog } from 'electron';
import { Subject, withLatestFrom, BehaviorSubject } from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import StoreService from '../../storeService';
import { fromIPC } from '../rx.utils';
import Logger from '../../logger';
import { Wallet } from '../../../shared/types';

const logger = Logger({ className: 'reactions/deleteWalletFile.ipc' });

const deleteWalletFile = async (
  mainWindow: BrowserWindow,
  filepath: string
) => {
  if (!mainWindow) return false;
  const options = {
    title: 'Delete File',
    message: 'All wallet data will be lost. Are You Sure?',
    buttons: ['Delete Wallet File', 'Cancel'],
  };
  const { response } = await dialog.showMessageBox(mainWindow, options);
  if (response === 0) {
    try {
      StoreService.clear();
      await fs.unlink(filepath);
    } catch (error) {
      logger.error('deleteWalletFile', error);
    }
    return true;
  }
  return false;
};

const handleDeleteWalletFile = (
  $mainWindow: Subject<BrowserWindow>,
  $wallet: BehaviorSubject<Wallet | null>,
  $walletPath: BehaviorSubject<string>
) => {
  const $req = fromIPC<string>(ipcConsts.W_M_SHOW_DELETE_FILE);
  const $s = $req.pipe(withLatestFrom($mainWindow));
  const sub = $s.subscribe(async ([path, mainWindow]) => {
    if (await deleteWalletFile(mainWindow, path)) {
      $wallet.next(null);
      $walletPath.next('');
      mainWindow.reload();
    }
  });
  return sub;
};

export default handleDeleteWalletFile;
