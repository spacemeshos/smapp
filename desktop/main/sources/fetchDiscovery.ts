import { of } from 'ramda';
import {
  catchError,
  delay,
  first,
  forkJoin,
  from,
  interval,
  map,
  Observable,
  retry,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { Network, NodeConfig, Wallet } from '../../../shared/types';
import {
  fetchNetworksFromDiscovery,
  generateGenesisIDFromConfig,
  listPublicApis,
} from '../Networks';
import { handleIPC, handlerResult, makeSubscription } from '../rx.utils';
import { downloadNodeConfig } from '../NodeConfig';

const fromDiscovery = () =>
  from(fetchNetworksFromDiscovery()).pipe(
    retry(3),
    delay(200),
    catchError(() => of([]))
  );

export const fromNetworkConfig = (v) =>
  from(downloadNodeConfig(v.conf)).pipe(
    retry(3),
    delay(200),
    catchError(() => of([]))
  );

export const fromNetworkWithGenesisIDMapping = () =>
  switchMap((networks: Network[]) =>
    forkJoin([
      ...networks.map(
        (net) => fromNetworkConfig(net) as Observable<NodeConfig>
      ),
    ]).pipe(
      map((configs) => {
        return networks.map(
          (net, i): Network => ({
            ...net,
            genesisID: generateGenesisIDFromConfig(configs[i]),
          })
        );
      })
    )
  );

export const fetchDiscovery = ($networks: Subject<Network[]>) =>
  makeSubscription(
    fromDiscovery().pipe(fromNetworkWithGenesisIDMapping()),
    (nets) => {
      $networks.next(nets);
    }
  );

export const fetchDiscoveryEach = (
  period: number,
  $networks: Subject<Network[]>
) =>
  makeSubscription(
    interval(period)
      .pipe(switchMap(fromDiscovery))
      .pipe(fromNetworkWithGenesisIDMapping()),
    (nets) => {
      nets.length > 0 && $networks.next(nets);
    }
  );

export const listNetworksByRequest = () =>
  makeSubscription(
    handleIPC(
      ipcConsts.LIST_NETWORKS,
      () =>
        fromDiscovery()
          .pipe(fromNetworkWithGenesisIDMapping())
          .pipe(map((nets) => handlerResult(nets))),
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
