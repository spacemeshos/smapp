import { BrowserWindow } from 'electron';
import { distinctUntilChanged, Observable, ReplaySubject, Subject } from 'rxjs';
import { NodeConfig } from '../../../shared/types';
import { checkUpdates } from '../autoUpdate';
import { Network } from '../context';
import { downloadNodeConfig } from '../NodeConfig';
import { withLatest, wrapFlow } from '../rx.utils';

export default (
  $currentNetwork: Observable<Network | null>,
  $nodeConfig: Subject<NodeConfig>,
  $mainWindow: ReplaySubject<BrowserWindow>
) =>
  wrapFlow(
    $currentNetwork.pipe(distinctUntilChanged(), withLatest($mainWindow)),
    async ([mw, net]) => {
      if (!net) return;
      const config = await downloadNodeConfig(net);
      $nodeConfig.next(config);
      mw && checkUpdates(mw, net);
    }
  );
