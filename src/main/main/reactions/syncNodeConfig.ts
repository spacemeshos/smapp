import {
  delay,
  distinctUntilChanged,
  filter,
  from,
  merge,
  Observable,
  retry,
  Subject,
  switchMap,
} from 'rxjs';
import { Network, NodeConfig } from '../../../shared/types';
import { SmeshingSetupState } from '../../NodeManager';
import { downloadNodeConfig } from '../NodeConfig';
import { makeSubscription } from '../rx.utils';

export default (
  $currentNetwork: Observable<Network | null>,
  $nodeConfig: Subject<NodeConfig>,
  $smeshingSetupState: Subject<SmeshingSetupState>
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
      switchMap((net) => from(downloadNodeConfig(net.conf, true))),
      retry(5),
      delay(500)
    ),
    (conf) => $nodeConfig.next(conf)
  );
