import {
  catchError,
  first,
  forkJoin,
  from,
  interval,
  map,
  Observable,
  pairwise,
  retry,
  startWith,
  Subject,
  switchMap,
  withLatestFrom,
  of as ofRx,
  RetryConfig,
  tap,
} from 'rxjs';
import { dissocPath, equals } from 'ramda';
import { ipcConsts } from '../../../app/vars';
import {
  Network,
  NetworkExtended,
  NodeConfig,
  Wallet,
} from '../../../shared/types';
import {
  fetchNetworksFromDiscovery,
  generateGenesisIDFromConfig,
  getDiscoveryUrl,
  listPublicApis,
} from '../Networks';
import { handleIPC, handlerResult, makeSubscription } from '../rx.utils';
import { fetchNodeConfig } from '../../utils';
import { Managers } from '../app.types';
import Logger from '../../logger';
import {
  getFallbackPath,
  loadFallbackConfig,
  loadFallbackNetworks,
  saveFallbackNetworks,
} from '../fallbackConfigs';
import { getConfigHashByURL } from '../configHash';
import Warning, { WarningType } from '../../../shared/warning';
import {
  DEFAULT_MAINNET_CONFIG,
  DEFAULT_NETWORKS_LIST,
} from '../../../shared/constants';

const logger = Logger({ className: 'fetchDiscovery' });

const RETRY_CONFIG: RetryConfig = {
  count: 3,
  delay: 10000, // Every 10 seconds
};

export const fromNetworkConfig = (
  net: Network,
  $warnings: Subject<Warning>
) => {
  logger.log('fromNetworkConfig', { net });

  const createWarning = (cacheHit: boolean, err: Error) => {
    $warnings.next(
      Warning.fromError(
        WarningType.CannotLoadConfigsFromDiscovery,
        {
          type: 'config',
          cacheHit,
          dir: getFallbackPath(''),
          url: getDiscoveryUrl(),
        },
        err
      )
    );
  };

  return ofRx(null).pipe(
    switchMap(() => {
      const prevHash = getConfigHashByURL(net.conf);
      return from(fetchNodeConfig(net.conf, prevHash));
    }),
    retry(RETRY_CONFIG),
    catchError((err) => {
      logger.error('fromNetworkConfig', err);

      // eslint-disable-next-line promise/no-promise-in-callback
      const result = loadFallbackConfig(net).then(
        (val) => {
          createWarning(true, err);
          return val;
        },
        (err) => {
          createWarning(false, err);
          return DEFAULT_MAINNET_CONFIG;
        }
      );

      return from(result);
    })
  );
};

export const extendWithConfig = ($warnings: Subject<Warning>) =>
  switchMap((networks: Network[]) =>
    forkJoin([
      ...networks.map(
        (net) => fromNetworkConfig(net, $warnings) as Observable<NodeConfig>
      ),
    ]).pipe(
      map((configs) => {
        return networks.map(
          (net, i): NetworkExtended => ({
            ...net,
            genesisID: generateGenesisIDFromConfig(configs[i]),
            config: configs[i],
          })
        );
      })
    )
  );

const fromDiscovery = ($warnings: Subject<Warning>) => {
  const createWarning = (cacheHit: boolean, err: Error) => {
    $warnings.next(
      Warning.fromError(
        WarningType.CannotLoadConfigsFromDiscovery,
        {
          type: 'networks',
          cacheHit,
          dir: getFallbackPath(''),
          url: getDiscoveryUrl(),
        },
        err
      )
    );
  };

  return ofRx(null).pipe(
    switchMap(() => from(fetchNetworksFromDiscovery())),
    retry(RETRY_CONFIG),
    extendWithConfig($warnings),
    tap((nets) => saveFallbackNetworks(nets)),
    catchError((err) => {
      logger.error('fromDiscovery()', err);

      // eslint-disable-next-line promise/no-promise-in-callback
      const result = loadFallbackNetworks().then(
        (val) => {
          createWarning(true, err);
          return val;
        },
        () => {
          createWarning(false, err);
          return DEFAULT_NETWORKS_LIST;
        }
      );

      return from(result);
    })
  );
};

export const fetchDiscovery = (
  $networks: Subject<NetworkExtended[]>,
  $warnings: Subject<Warning>
) => makeSubscription(fromDiscovery($warnings), (nets) => $networks.next(nets));

export const fetchDiscoveryEvery = (
  period: number,
  $networks: Subject<NetworkExtended[]>,
  $warnings: Subject<Warning>
) =>
  makeSubscription(
    interval(period).pipe(switchMap(() => fromDiscovery($warnings))),
    (nets) => nets.length > 0 && $networks.next(nets)
  );

export const listNetworksByRequest = (
  $networks: Subject<NetworkExtended[]>,
  $warnings: Subject<Warning>
) =>
  makeSubscription(
    handleIPC(
      ipcConsts.LIST_NETWORKS,
      () => fromDiscovery($warnings).pipe(map((nets) => handlerResult(nets))),
      (nets) => nets
    ),
    (networks) => {
      $networks.next(networks);
    }
  );

export const listenNodeConfigAndRestartNode = (
  $nodeConfig: Observable<NodeConfig>,
  $managers: Subject<Managers>
) =>
  makeSubscription(
    $nodeConfig.pipe(startWith(null), pairwise(), withLatestFrom($managers)),
    ([[prevNodeConfig, nextNodeConfig], managers]) => {
      (async () => {
        // Do not restart the Node if...
        // A. it's a first Config ever
        if (prevNodeConfig === null) return;
        // B. configs are equal
        if (equals(prevNodeConfig, nextNodeConfig)) return;
        // C. Node is not running
        if (!managers.node.isNodeRunning()) return;
        // D. if User only turned smeshing off (and the rest config not changed)
        if (
          prevNodeConfig?.smeshing?.['smeshing-start'] === true &&
          nextNodeConfig?.smeshing?.['smeshing-start'] === false &&
          equals(
            dissocPath(['smeshing', 'smeshing-start'], prevNodeConfig),
            dissocPath(['smeshing', 'smeshing-start'], nextNodeConfig)
          )
        )
          return;

        // In other cases — restart the Node
        logger.log(
          'listenNodeConfigAndRestartNode',
          'Node config changed. Restart the Node'
        );
        await managers.node.restartNode();
      })();
    }
  );

export const listPublicApisByRequest = (
  $wallet: Subject<Wallet | null>,
  $warnings: Subject<Warning>
) =>
  makeSubscription(
    handleIPC(
      ipcConsts.LIST_PUBLIC_SERVICES,
      (selectedGenesisID: string) =>
        fromDiscovery($warnings).pipe(
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
