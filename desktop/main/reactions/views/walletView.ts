import { applySpec, mergeLeft, objOf, pathOr, propOr } from 'ramda';
import { combineLatest, map, Subject } from 'rxjs';
import { Wallet } from '../../../../shared/types';

export default (
  $wallet: Subject<Wallet | null>,
  $walletPath: Subject<string>
) =>
  combineLatest([$wallet, $walletPath] as const).pipe(
    map(([wallet, currentWalletPath]) =>
      mergeLeft(
        applySpec({
          meta: propOr({}, 'meta'),
          mnemonic: pathOr('', ['crypto', 'mnemonic']),
          accounts: pathOr([], ['crypto', 'accounts']),
          contacts: pathOr([], ['crypto', 'contacts']),
        })(wallet || {}),
        { currentWalletPath }
      )
    ),
    map(objOf('wallet'))
  );
