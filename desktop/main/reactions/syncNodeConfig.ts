import {
  catchError,
  distinctUntilChanged,
  filter,
  from,
  merge,
  Observable,
  Subject,
  switchMap,
  throwError,
} from 'rxjs';
import { NetworkExtended, NodeConfig } from '../../../shared/types';
import Warning, { WarningType } from '../../../shared/warning';
import { SmeshingSetupState } from '../../NodeManager';
import { makeSubscription } from '../rx.utils';
import { mergeConfigs } from '../NodeConfig';

export default (
  $currentNetwork: Observable<NetworkExtended | null>,
  $nodeConfig: Subject<NodeConfig>,
  $smeshingSetupState: Subject<SmeshingSetupState>,
  $warnings: Subject<Warning>
) =>
  makeSubscription(
    merge(
      $currentNetwork.pipe(filter(Boolean), distinctUntilChanged()),
      $smeshingSetupState.pipe(
        filter((value) => value !== SmeshingSetupState.ViaAPI),
        switchMap(() => $currentNetwork),
        filter(Boolean)
      )
    ).pipe(
      switchMap((net) => from(mergeConfigs(net.genesisID, net.config))),
      catchError((err: any) => {
        $warnings.next(
          err instanceof Warning
            ? err
            : Warning.fromError(err.type || WarningType.Unknown, {}, err)
        );
        return throwError(() => err);
      })
    ),
    (conf) => {
      $nodeConfig.next(conf.mergedConfig as NodeConfig);
    }
  );
