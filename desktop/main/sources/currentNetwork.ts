import { find } from 'ramda';
import {
  combineLatestWith,
  distinctUntilChanged,
  from,
  iif,
  map,
  mergeWith,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';
import { Network, Wallet } from '../../../shared/types';
import NodeConfig from '../NodeConfig';

export default (
  $runNodeBeforeLogin: Observable<boolean>,
  $wallet: Subject<Wallet | null>,
  $networks: Subject<Network[]>
) =>
  $networks.pipe(
    combineLatestWith($runNodeBeforeLogin),
    mergeWith($wallet),
    distinctUntilChanged(),
    switchMap((input) => {
      // @ts-ignore
      const wallet = input?.meta;
      const runNodeOnStart = input?.[1];

      return iif(
        () => runNodeOnStart && !wallet,
        $networks.pipe(
          combineLatestWith(
            from(NodeConfig.load()).pipe(map((c) => c?.p2p['network-id']))
          )
        ),
        $networks.pipe(
          combineLatestWith($wallet.pipe(map((w) => w?.meta.netId)))
        )
      );
    }),
    map(
      ([networks, networkId]) =>
        find((net) => net.netID === networkId, networks) || null
    )
  );
