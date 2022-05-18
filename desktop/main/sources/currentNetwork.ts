import { find } from 'ramda';
import { combineLatest, map, Subject } from 'rxjs';
import { Wallet } from '../../../shared/types';
import { Network } from '../context';

export default (
  $wallet: Subject<Wallet | null>,
  $networks: Subject<Network[]>
) =>
  combineLatest([$wallet, $networks]).pipe(
    map(
      ([wallet, networks]) =>
        find((net) => net.netID === wallet?.meta.netId, networks) || null
    )
  );
