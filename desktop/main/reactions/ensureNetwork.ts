import { BrowserWindow } from 'electron';
import { combineLatest, debounceTime, filter, Observable } from 'rxjs';
import { Wallet } from '../../../shared/types';
import { isWalletOnlyType } from '../../../shared/utils';
import { Network } from '../app.types';
import { withLatest, makeSubscription } from '../rx.utils';

export default (
  $wallet: Observable<Wallet | null>,
  $networks: Observable<Network[]>,
  $currentNetwork: Observable<Network | null>,
  $mainWindow: Observable<BrowserWindow>
) =>
  makeSubscription(
    combineLatest([
      $wallet.pipe(filter(Boolean)),
      $networks,
      $currentNetwork,
    ]).pipe(debounceTime(20), withLatest($mainWindow)),
    ([mw, [wallet, nets, curNet]]) => {
      if (mw && !curNet && nets.length > 0) {
        mw.webContents.send('REQUEST_SWITCH_NETWORK', {
          isWalletOnly: wallet ? isWalletOnlyType(wallet.meta.type) : false,
        });
      }
    }
  );
