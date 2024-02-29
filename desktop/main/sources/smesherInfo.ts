import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  from,
  interval,
  map,
  merge,
  Observable,
  of,
  share,
  Subject,
  switchMap,
  withLatestFrom,
  tap,
  debounceTime,
} from 'rxjs';
import {
  NodeConfig,
  NodeEvent,
  Wallet,
  WalletType,
} from '../../../shared/types';
import { isObject, parseTimestamp } from '../../../shared/utils';
import { SmeshingSetupState } from '../../NodeManager';
import { Managers } from '../app.types';
import { MINUTE } from '../../../shared/constants';
import { Event } from '../../../api/generated/spacemesh/v1/Event';
import { isSmeshingOpts, safeSmeshingOpts } from '../smeshingOpts';
import Logger from '../../logger';

const transformEvent = (e: Event): NodeEvent => {
  const transformProp = (key, prop) => {
    if (key === 'timestamp' || key === 'wait') {
      return parseTimestamp(prop);
    }
    return prop;
  };
  const transform = (e) =>
    Object.entries(e).reduce((prev, [key, val]) => {
      const nextVal = transformProp(key, val);
      return {
        ...prev,
        [key]: isObject(nextVal) ? transform(nextVal) : nextVal,
      };
    }, {});
  return transform(e);
};

const syncSmesherInfo = (
  $managers: Observable<Managers>,
  $isWalletActivated: Subject<void>,
  $wallet: BehaviorSubject<Wallet | null>,
  $nodeConfig: Observable<NodeConfig>
) => {
  const logger = Logger({ className: 'syncSmesherInfo' });

  const $smeshingSetupState = new Subject<SmeshingSetupState>();
  const $smeshingStarted = $smeshingSetupState.pipe(
    filter((s) => s !== SmeshingSetupState.Failed)
  );

  const $isLocalNode = $wallet.pipe(
    filter(Boolean),
    map((wallet) => wallet.meta.type !== WalletType.RemoteApi)
  );

  const $genesisId = $wallet.pipe(
    filter(Boolean),
    map((wallet) => wallet.meta.genesisID),
    distinctUntilChanged(),
    share()
  );

  const $smeshingOpts = combineLatest([$nodeConfig, $genesisId]).pipe(
    map(([config, genesisId]) => safeSmeshingOpts(config.smeshing, genesisId)),
    filter(isSmeshingOpts)
  );

  const $isSmeshing = merge(
    $isWalletActivated,
    $smeshingStarted,
    interval(5 * MINUTE)
  ).pipe(
    withLatestFrom($managers, $isLocalNode),
    switchMap(([_, managers, isLocalNode]) => {
      if (isLocalNode) {
        return from(managers.smesher.isSmeshing().catch(() => false));
      }
      return of(false);
    }),
    tap((x) => logger.log('$isSmeshing', x)),
    share()
  );

  const $smesherIds = combineLatest([
    $isLocalNode,
    $managers,
    $isWalletActivated,
  ]).pipe(
    switchMap(([isLocalNode, managers]) =>
      from(
        (async () => {
          if (!isLocalNode) return [];
          if (await managers.node.getNodeStatus()) {
            return managers.smesher.getSmesherIds().catch(() => []);
          }
          throw new Error('getSmesherIds(): Can not reach the Node');
        })()
      )
    ),
    share()
  );

  const $coinbase = $smeshingOpts.pipe(
    map((c) => c['smeshing-coinbase']),
    tap((x) => logger.log('$coinbase', x)),
    share()
  );

  const $nodeEvents = new Subject<NodeEvent>();

  const $rewardsControlTuple = combineLatest([
    $coinbase,
    $genesisId,
    $managers,
    $isWalletActivated,
  ]).pipe(
    debounceTime(30000),
    tap(() => logger.log('$rewardsControlTuple', 'updated')),
    share()
  );

  $rewardsControlTuple.subscribe(([coinbase, genesisId, managers]) => {
    logger.log('smesherInfo', 'Subscribe on updates for', {
      coinbase,
      genesisId,
    });
    return managers.wallet.subscribeForAddressData(coinbase);
  });

  combineLatest([$isSmeshing, $managers, $isLocalNode]).subscribe(
    ([_, managers, isLocalNode]) => {
      if (!isLocalNode) return;
      logger.log('subscribe for NodeEvents', null);
      managers.smesher.subscribeNodeEvents((err, event) => {
        if (err || !event) {
          logger.error('subscribeNodeEvents', err, event);
          return;
        }
        $nodeEvents.next(transformEvent(event));
      });
    }
  );

  return {
    $smesherIds,
    $coinbase,
    $smeshingStarted,
    $smeshingSetupState,
    $nodeEvents: $nodeEvents.asObservable(),
  };
};

export default syncSmesherInfo;
