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
  debounceTime,
} from 'rxjs';
import { Reward__Output } from '../../../proto/spacemesh/v1/Reward';
import {
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

  const $smesherId = combineLatest([
    $isLocalNode,
    $managers,
    $isWalletActivated,
  ]).pipe(
    switchMap(([isLocalNode, managers]) =>
      from(
        (async () => {
          if (!isLocalNode) return '';
          if (await managers.node.getNodeStatus()) {
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

  const $rewardsHistorical = $rewardsControlTuple.pipe(
    switchMap(([coinbase, genesisId, managers]) => {
      logger.log('$rewardsHistorical', 'Fetching historical rewards for', {
        coinbase,
        genesisId,
      });
      return from(managers.wallet.requestRewardsByCoinbase(coinbase));
    }),
    concatMap((x) => x)
  );

  const $rewardsStream = new Subject<Reward>();

  $rewardsControlTuple.subscribe(([coinbase, genesisId, managers]) => {
    logger.log('$rewardsStream', 'Subscribe on new rewards for', {
      coinbase,
      genesisId,
    });
    return managers.wallet.listenRewardsByCoinbase(coinbase, (x) => {
      const reward = toReward(x);
      logger.log('$rewardsStream', 'Got new reward', reward);
      $rewardsStream.next(reward);
    });
  });

  const $rewards = merge($rewardsHistorical, $rewardsStream).pipe(
    scan((acc, next) => {
      const key = `${next.layer}$${next.amount}`;
      return shallowEq(acc.get(key) || {}, next) ? acc : acc.set(key, next);
    }, new Map<string, Reward>()),
    map((uniqRewards) => Array.from(uniqRewards.values())),
    shareReplay(1),
    distinctUntilChanged((prev, next) => prev.length === next.length),
    map((rewards) => rewards.sort((a, b) => a.layer - b.layer)),
    debounceTime(5000)
  );

  $rewards.subscribe((r) => {
    logger.log('$rewards updated:', r.length);
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
    $smesherId,
    $rewards,
    $coinbase,
    $smeshingStarted,
    $smeshingSetupState,
    $nodeEvents: $nodeEvents.asObservable(),
  };
};

export default syncSmesherInfo;
