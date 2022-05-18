import { mergeLeft, objOf } from 'ramda';
import { combineLatest, map, Subject } from 'rxjs';
import { Wallet } from '../../../../shared/types';
import { ifTruish, remap } from '../../../../shared/utils';

export default (
  $wallet: Subject<Wallet | null>,
  $walletPath: Subject<string>
) =>
  combineLatest([$wallet, $walletPath] as const).pipe(
    map(([wallet, currentWalletPath]) =>
      mergeLeft(
        ifTruish(
          wallet,
          remap({
            meta: ['meta'],
            mnemonic: ['crypto', 'mnemonic'],
            accounts: ['crypto', 'accounts'],
            contacts: ['crypto', 'contacts'],
          }),
          {} as Record<string, string>
        ),
        { currentWalletPath }
      )
    ),
    map(objOf('wallet'))
  );
