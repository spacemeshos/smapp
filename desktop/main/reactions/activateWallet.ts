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
      const res = await managers.wallet.activate(wallet);
      if (res) {
        managers.wallet.activateAccounts(wallet.crypto.accounts);
        $isWalletActivated.next();
      }
      // Renderer waits for WALLET_ACTIVATED event
      // to show the next screen, so we send it anyway
      mw.webContents.send(ipcConsts.WALLET_ACTIVATED);
    }
  );
