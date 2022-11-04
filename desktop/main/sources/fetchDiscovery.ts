import { of } from 'ramda';
import {
  catchError,
  delay,
  first,
  from,
  interval,
  map,
  retry,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { Network, Wallet } from '../../../shared/types';
import { fetchNetworksFromDiscovery, listPublicApis } from '../Networks';
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
  makeSubscription(
    interval(period).pipe(switchMap(fromDiscovery)),
    (nets) => nets.length > 0 && $networks.next(nets)
  );

export const listNetworksByRequest = () =>
  makeSubscription(
    handleIPC(
      ipcConsts.LIST_NETWORKS,
      () => fromDiscovery().pipe(map((nets) => handlerResult(nets))),
      (nets) => nets
    ),
    (_) => {}
  );

export const listPublicApisByRequest = ($wallet: Subject<Wallet | null>) =>
  makeSubscription(
    handleIPC(
      ipcConsts.LIST_PUBLIC_SERVICES,
      (selectedGenesisID: string) =>
        fromDiscovery().pipe(
          withLatestFrom($wallet),
          first(),
          map(([nets, wallet]) => {
            const net = nets.find(
              (n) =>
                n.genesisID === wallet?.meta.genesisID ||
                n.genesisID === selectedGenesisID
            );
            return handlerResult(listPublicApis(net || null));
          })
        ),
      (apis) => apis
    ),
    (_) => {}
  );
