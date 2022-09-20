import {
  BehaviorSubject,
  combineLatest,
  concat,
  distinctUntilChanged,
  filter,
  first,
  from,
  interval,
  map,
  merge,
  Observable,
  of,
  scan,
  share,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { Reward__Output } from '../../../proto/spacemesh/v1/Reward';
import {
  Activation,
  SmesherReward,
  Wallet,
  WalletType,
} from '../../../shared/types';
import { hasRequiredRewardFields } from '../../../shared/types/guards';
import Logger from '../../logger';
import { Managers } from '../app.types';
import { MINUTE } from '../constants';

const logger = Logger({ className: 'smesherInfo' });

const getRewards$ = (
  managers: Managers,
  coinbase: string
): Observable<Reward__Output[]> =>
  from(managers.wallet.requestRewardsByCoinbase(coinbase));

const toSmesherReward = (input: Reward__Output): SmesherReward => {
  if (!hasRequiredRewardFields(input)) {
    throw new Error(
      `Can not convert input ${JSON.stringify(input)} to SmesherReward`
    );
  }
  return {
    layer: input.layer.number,
    layerReward: input.layerReward.value.toNumber(),
    total: input.total.value.toNumber(),
    coinbase: input.coinbase.address,
  };
};

const getActivations$ = (
  managers: Managers,
  coinbase: string
): Observable<Activation[]> =>
  from(managers.wallet.requestActivationsByCoinbase(coinbase));

const syncSmesherInfo = (
  $managers: Observable<Managers>,
  $isWalletActivated: Subject<void>,
  $wallet: BehaviorSubject<Wallet | null>
) => {
  const $smeshingStarted = new Subject<void>();

  const $isLocalNode = $wallet.pipe(
    filter(Boolean),
    map((wallet) => wallet.meta.type === WalletType.LocalNode),
    distinctUntilChanged(),
    filter(Boolean)
  );

  const $isSmeshing = $isLocalNode.pipe(
    switchMap(() =>
      merge($isWalletActivated, $smeshingStarted, interval(5 * MINUTE))
    ),
    withLatestFrom($managers),
    switchMap(([_, managers]) => from(managers.smesher.isSmeshing()))
  );

  const $smesherId = $isLocalNode.pipe(
    switchMap(() => combineLatest([$managers, $isWalletActivated])),
    switchMap(([managers]) =>
      from(
        (async () => {
          if (await managers.node.getNodeStatus(60)) {
            const smesherId = await managers.smesher.getSmesherId();
            return smesherId || '';
          }
          throw new Error('getSmesherId(): Can not reach the Node');
        })()
      )
    )
  );
  const $coinbase = $isSmeshing.pipe(
    filter(Boolean),
    withLatestFrom($managers),
    switchMap(([_, managers]) =>
      from(
        managers.smesher.getCoinbase().then((res) => {
          if (!res) return null;
          if (res.error) {
            logger.error('getCoinbase() return', res);
            return null;
          }
          return res.coinbase;
        })
      )
    ),
    filter(Boolean)
  );

  const $rewardsHistory = combineLatest([$coinbase, $managers]).pipe(
    switchMap(([coinbase, managers]) => getRewards$(managers, coinbase)),
    map((rewards) => rewards.map(toSmesherReward))
  );
  const $rewardsStream = $isLocalNode.pipe(
    switchMap(() => combineLatest([$coinbase, $managers])),
    switchMap(([coinbase, managers]) =>
      new Observable<Reward__Output>((subscriber) =>
        managers.wallet.listenRewardsByCoinbase(coinbase, (x) =>
          subscriber.next(x)
        )
      ).pipe(share())
    )
  );

  const $rewards = concat(
    of([]),
    $rewardsHistory,
    $rewardsStream.pipe(
      scan((acc, next) => {
        if (hasRequiredRewardFields(next)) {
          acc.push(toSmesherReward(next));
        }
        return acc;
      }, <SmesherReward[]>[])
    )
  );

  const $activationsStream = combineLatest([$coinbase, $managers]).pipe(
    first(),
    switchMap(([coinbase, managers]) =>
      new Observable<Activation>((subscriber) =>
        managers.wallet.listenActivationsByCoinbase(coinbase, (atx) =>
          subscriber.next(atx)
        )
      ).pipe(share())
    )
  );
  const $activationsHistory = combineLatest([$coinbase, $managers]).pipe(
    switchMap(([coinbase, managers]) => getActivations$(managers, coinbase))
  );

  const $activations = concat(
    $activationsHistory,
    $activationsStream.pipe(
      scan<Activation, Activation[]>((acc, next) => [...acc, next], [])
    )
  );

  return {
    $smesherId,
    $activations,
    $rewards,
    $coinbase,
    $smeshingStarted,
  };
};

export default syncSmesherInfo;
