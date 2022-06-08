import {
  delay,
  distinctUntilChanged,
  filter,
  from,
  Observable,
  retry,
  Subject,
  switchMap,
} from 'rxjs';
import { Network, NodeConfig } from '../../../shared/types';
import { downloadNodeConfig } from '../NodeConfig';
import { makeSubscription } from '../rx.utils';

export default (
  $currentNetwork: Observable<Network | null>,
  $nodeConfig: Subject<NodeConfig>
) =>
  makeSubscription(
    $currentNetwork.pipe(
      filter(Boolean),
      distinctUntilChanged(),
      switchMap((net) => from(downloadNodeConfig(net.conf))),
      retry(5),
      delay(500)
    ),
    (conf) => $nodeConfig.next(conf)
  );
