import { BrowserWindow } from 'electron';
import { combineLatest, Observable, Subject } from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { Wallet } from '../../../shared/types';
import { isWalletOnlyType } from '../../../shared/utils';
import { Managers } from '../app.types';
import { makeSubscription } from '../rx.utils';

export default (
  $wallet: Observable<Wallet | null>,
  $managers: Observable<Managers>,
  $isWalletActivated: Subject<void>,
  $mainWindow: Observable<BrowserWindow>
) =>
  makeSubscription(
    combineLatest([$wallet, $managers, $mainWindow]),
    async ([wallet, managers, mw]) => {
      if (
        !wallet ||
        !wallet.meta.netId ||
        (isWalletOnlyType(wallet.meta.type) && !wallet.meta.remoteApi)
      ) {
        return;
      }
      await managers.wallet.activate(wallet);
      managers.wallet.activateAccounts(wallet.crypto.accounts);
      $isWalletActivated.next();
      mw.webContents.send(ipcConsts.WALLET_ACTIVATED);
    }
  );
