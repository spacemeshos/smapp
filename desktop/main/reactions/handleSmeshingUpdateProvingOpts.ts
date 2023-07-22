import {
  Observable,
  combineLatest,
  Subject,
  filter,
  distinctUntilChanged,
} from 'rxjs';
import * as R from 'ramda';
import { equals } from 'ramda';
import { makeSubscription } from '../rx.utils';
import { NodeConfig, Wallet, WalletType } from '../../../shared/types';
import Warning, { WarningType } from '../../../shared/warning';

export default (
  $wallet: Observable<Wallet | null>,
  $nodeConfig: Subject<NodeConfig>,
  $warnings: Subject<Warning>
) =>
  makeSubscription(
    combineLatest([$wallet, $nodeConfig]).pipe(
      filter(
        ([wallet, nodeConfig]) =>
          nodeConfig &&
          Boolean(nodeConfig?.smeshing) &&
          wallet?.meta.type !== WalletType.RemoteApi
      ),
      distinctUntilChanged((prev, next) =>
        equals(prev[1]?.smeshing, next[1]?.smeshing)
      )
    ),
    ([_, nodeConfig]) => {
      const isSmeshingSetUp = R.pathOr(
        null,
        ['smeshing-start'],
        nodeConfig.smeshing
      );

      const nonces = R.pathOr(
        null,
        ['smeshing-proving-opts', 'smeshing-opts-proving-nonces'],
        nodeConfig.smeshing
      );
      const threads = R.pathOr(
        null,
        ['smeshing-proving-opts', 'smeshing-opts-proving-threads'],
        nodeConfig.smeshing
      );

      if (isSmeshingSetUp !== null && !nonces && !threads) {
        $warnings.next(
          new Warning(WarningType.UpdateSmeshingProvingOpts, {
            payload: {},
            message: 'No smeshing proving opts',
          })
        );
      }
    }
  );
