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
import { wrapFlow } from '../rx.utils';

const fromDiscovery = () =>
  from(fetchNetworksFromDiscovery()).pipe(
    retry(3),
    delay(200),
    catchError(() => of([]))
  );

export const fetchDiscovery = ($networks: Subject<Network[]>) =>
  wrapFlow(fromDiscovery(), (nets) => $networks.next(nets));

export const fetchDiscoveryEach = (
  period: number,
  $networks: Subject<Network[]>
) =>
  wrapFlow(interval(period).pipe(switchMap(fromDiscovery)), (nets) =>
    $networks.next(nets)
  );
