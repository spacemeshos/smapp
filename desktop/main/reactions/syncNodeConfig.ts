import {
  catchError,
  delay,
  distinctUntilChanged,
  filter,
  from,
  merge,
  Observable,
  retry,
  Subject,
  switchMap,
  throwError,
} from 'rxjs';
import { Network, NodeConfig } from '../../../shared/types';
import { SmeshingSetupState } from '../../NodeManager';
import { downloadNodeConfig } from '../NodeConfig';
import { makeSubscription } from '../rx.utils';

export default (
  $currentNetwork: Observable<Network | null>,
  $nodeConfig: Subject<NodeConfig>,
  $smeshingSetupState: Subject<SmeshingSetupState>,
  $notifications: Subject<string | Error>
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
      switchMap((net) => from(downloadNodeConfig(net.conf))),
      retry(5),
      delay(500),
      catchError((err) => {
        $notifications.next(err);
        return throwError(err);
      })
    ),
    (conf) => $nodeConfig.next(conf as NodeConfig)
  );
