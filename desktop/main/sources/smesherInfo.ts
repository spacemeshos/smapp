import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  distinctUntilChanged,
  filter,
  from,
  interval,
  map,
  merge,
  Observable,
  of,
  scan,
  share,
  shareReplay,
  Subject,
  switchMap,
  withLatestFrom,
  tap,
} from 'rxjs';
import { Reward__Output } from '../../../proto/spacemesh/v1/Reward';
import {
  HexString,
  NodeConfig,
  NodeEvent,
  Reward,
  Wallet,
  WalletType,
} from '../../../shared/types';
import { hasRequiredRewardFields } from '../../../shared/types/guards';
import {
  isObject,
  longToNumber,
  parseTimestamp,
  shallowEq,
} from '../../../shared/utils';
import { SmeshingSetupState } from '../../NodeManager';
import { Managers } from '../app.types';
import { MINUTE } from '../constants';
import { Event } from '../../../proto/spacemesh/v1/Event';
import { isSmeshingOpts, safeSmeshingOpts } from '../smeshingOpts';
import Logger from '../../logger';

const toReward = (input: Reward__Output): Reward => {
  if (!hasRequiredRewardFields(input)) {
    throw new Error(
      `Can not convert input ${JSON.stringify(input)} to SmesherReward`
    );
  }
  return {
    layer: input.layer.number,
    layerReward: longToNumber(input.layerReward.value),
    amount: longToNumber(input.total.value),
    coinbase: input.coinbase.address,
  };
};

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

const getRewardsStream$ = (
  managers: Managers,
  coinbase: HexString
): Observable<Reward> =>
  new Observable<Reward>((subscriber) =>
    managers.wallet.listenRewardsByCoinbase(coinbase, (x) => {
      subscriber.next(toReward(x));
    })
  );

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
    map((wallet) => wallet.meta.type === WalletType.LocalNode)
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

  const $smesherId = combineLatest([
    $isLocalNode,
    $managers,
    $isWalletActivated,
  ]).pipe(
    switchMap(([isLocalNode, managers]) =>
      from(
        (async () => {
          if (!isLocalNode) return '';
          if (await managers.node.getNodeStatus(60)) {
            const smesherId = await managers.smesher
              .getSmesherId()
              .catch(() => '');
            return smesherId || '';
          }
          throw new Error('getSmesherId(): Can not reach the Node');
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

  const $rewards = combineLatest([$coinbase, $genesisId, $managers]).pipe(
    switchMap(([coinbase, genesisId, managers]) => {
      logger.log(
        '$rewards',
        'Going to fetch historical data and subscribe on new rewards',
        { coinbase, genesisId }
      );
      const historicalRewards = from(
        managers.wallet.requestRewardsByCoinbase(coinbase)
      ).pipe(concatMap((x) => x));

      return merge(
        historicalRewards,
        getRewardsStream$(managers, coinbase)
      ).pipe(
        scan((acc, next) => {
          const key = `${next.layer}$${next.amount}`;
          return shallowEq(acc.get(key) || {}, next) ? acc : acc.set(key, next);
        }, new Map<string, Reward>()),
        map((uniqRewards) => Array.from(uniqRewards.values()))
      );
    }),
    tap((x) => logger.log('$rewards', `${x.length} rewards`)),
    shareReplay(1),
    distinctUntilChanged((prev, next) => prev.length === next.length),
    map((rewards) => rewards.sort((a, b) => a.layer - b.layer))
  );

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
    $smesherId,
    $rewards,
    $coinbase,
    $smeshingStarted,
    $smeshingSetupState,
    $nodeEvents: $nodeEvents.asObservable(),
  };
};

export default syncSmesherInfo;
