import { distinctUntilChanged, Observable, Subject } from 'rxjs';
import { Network, NodeConfig } from '../../../shared/types';
import { downloadNodeConfig } from '../NodeConfig';
import { makeSubscription } from '../rx.utils';

export default (
  $currentNetwork: Observable<Network | null>,
  $nodeConfig: Subject<NodeConfig>
) =>
  makeSubscription(
    $currentNetwork.pipe(distinctUntilChanged()),
    async (net) => {
      if (!net) return;
      $nodeConfig.next(await downloadNodeConfig(net.conf));
    }
  );
