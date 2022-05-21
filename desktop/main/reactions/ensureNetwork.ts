import { BrowserWindow } from 'electron';
import { combineLatest, debounceTime, Observable } from 'rxjs';
import { Network, Wallet } from '../../../shared/types';
import { isWalletOnlyType } from '../../../shared/utils';
import { withLatest, makeSubscription } from '../rx.utils';

export default (
  $wallet: Observable<Wallet | null>,
  $networks: Observable<Network[]>,
  $currentNetwork: Observable<Network | null>,
  $mainWindow: Observable<BrowserWindow>
) =>
  makeSubscription(
    combineLatest([$wallet, $networks, $currentNetwork]).pipe(
      debounceTime(20),
      withLatest($mainWindow)
    ),
    ([mw, [wallet, nets, curNet]]) => {
      if (mw && wallet && !curNet && nets.length > 0) {
        mw.webContents.send('REQUEST_SWITCH_NETWORK', {
          isWalletOnly: wallet ? isWalletOnlyType(wallet.meta.type) : false,
        });
      }
    }
  );
