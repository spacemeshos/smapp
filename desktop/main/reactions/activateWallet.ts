import { BrowserWindow } from 'electron';
import { combineLatest, map, Observable, startWith, Subject } from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { Wallet } from '../../../shared/types';
import { isWalletOnlyType } from '../../../shared/utils';
import { Managers } from '../app.types';
import { makeSubscription } from '../rx.utils';

export default (
  $wallet: Observable<Wallet | null>,
  $managers: Observable<Managers>,
  $isWalletActivated: Subject<void>,
  $mainWindow: Observable<BrowserWindow>,
  $nodeRestartRequest: Observable<void>
) =>
  makeSubscription(
    combineLatest([
      $wallet,
      $managers,
      $mainWindow,
      $nodeRestartRequest.pipe(
        map(() => true),
        startWith(false)
      ),
    ]),
    async ([wallet, managers, mw, shallRestart]) => {
      if (
        !wallet ||
        !wallet.meta.netId ||
        (isWalletOnlyType(wallet.meta.type) && !wallet.meta.remoteApi)
      ) {
        return;
      }
      if (shallRestart) {
        await managers.node.stopNode();
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
