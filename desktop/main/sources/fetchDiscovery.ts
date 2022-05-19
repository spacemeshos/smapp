import { of } from 'ramda';
import {
  catchError,
  delay,
  from,
  interval,
  retry,
  Subject,
  switchMap,
} from 'rxjs';
import { Network } from '../context';
import { fetchNetworksFromDiscovery } from '../Networks';
import { makeSubscription } from '../rx.utils';

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
