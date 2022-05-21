import { of } from 'ramda';
import {
  catchError,
  delay,
  from,
  interval,
  map,
  retry,
  Subject,
  switchMap,
} from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { Network } from '../../../shared/types';
import { fetchNetworksFromDiscovery } from '../Networks';
import { handleIPC, handlerResult, makeSubscription } from '../rx.utils';

const fromDiscovery = () =>
  from(fetchNetworksFromDiscovery()).pipe(
    retry(3),
    delay(200),
    catchError(() => of([]))
  );

export const fetchDiscovery = ($networks: Subject<Network[]>) =>
  makeSubscription(fromDiscovery(), (nets) => $networks.next(nets));

export const fetchDiscoveryEach = (
  period: number,
  $networks: Subject<Network[]>
) =>
  makeSubscription(interval(period).pipe(switchMap(fromDiscovery)), (nets) =>
    $networks.next(nets)
  );

export const updateDiscoveryByRequest = ($networks: Subject<Network[]>) =>
  makeSubscription(
    handleIPC(
      ipcConsts.LIST_NETWORKS,
      () => fromDiscovery().pipe(map((nets) => handlerResult(nets))),
      (nets) => nets
    ),
    (nets) => $networks.next(nets)
  );
