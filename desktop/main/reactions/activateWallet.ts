import { combineLatest, Observable } from 'rxjs';
import { Wallet } from '../../../shared/types';
import { Managers } from '../Networks';
import { wrapFlow } from '../rx.utils';

export default (
  $wallet: Observable<Wallet | null>,
  $managers: Observable<Managers>
) =>
  wrapFlow(combineLatest([$wallet, $managers]), async ([wallet, managers]) => {
    if (!wallet) return;
    await managers.wallet.activate(wallet);
    managers.wallet.activateAccounts(wallet.crypto.accounts);
  });
