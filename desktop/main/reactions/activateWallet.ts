import { combineLatest, Observable, Subject } from 'rxjs';
import { Wallet } from '../../../shared/types';
import { Managers } from '../app.types';
import { makeSubscription } from '../rx.utils';

export default (
  $wallet: Observable<Wallet | null>,
  $managers: Observable<Managers>,
  $isWalletActivated: Subject<void>
) =>
  makeSubscription(
    combineLatest([$wallet, $managers]),
    async ([wallet, managers]) => {
      if (!wallet) return;
      await managers.wallet.activate(wallet);
      managers.wallet.activateAccounts(wallet.crypto.accounts);
      $isWalletActivated.next();
    }
  );
