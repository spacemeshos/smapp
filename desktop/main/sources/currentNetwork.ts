import { find } from 'ramda';
import {
  combineLatestWith,
  distinctUntilChanged,
  from,
  iif,
  map,
  Observable,
  share,
  Subject,
  switchMap,
} from 'rxjs';
import { Network, Wallet } from '../../../shared/types';
import NodeConfig from '../NodeConfig';
import { generateGenesisIDFromConfig } from '../Networks';

export default (
  $runNodeBeforeLogin: Observable<boolean>,
  $wallet: Subject<Wallet | null>,
  $networks: Subject<Network[]>
) =>
  $networks.pipe(
    combineLatestWith($runNodeBeforeLogin, $wallet),
    switchMap(([_, runNodeOnStart, wallet]) => {
      return iif(
        () => runNodeOnStart && !wallet,
        $networks.pipe(
          combineLatestWith(
            from(NodeConfig.load()).pipe(map(generateGenesisIDFromConfig))
          )
        ),
        $networks.pipe(
          combineLatestWith($wallet.pipe(map((w) => w?.meta.genesisID)))
        )
      );
    }),
    distinctUntilChanged(
      (prev, next) => prev[0] === next[0] && prev[1] === next[1]
    ),
    map(
      ([networks, genesisID]) =>
        find((net) => net.genesisID === genesisID, networks) || null
    ),
    share()
  );
