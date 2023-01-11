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
  shareReplay,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { Reward__Output } from '../../../proto/spacemesh/v1/Reward';
import {
  Activation,
  HexString,
  Reward,
  Wallet,
  WalletType,
} from '../../../shared/types';
import { hasRequiredRewardFields } from '../../../shared/types/guards';
import { longToNumber } from '../../../shared/utils';
import Logger from '../../logger';
import { SmeshingSetupState } from '../../NodeManager';
import { Managers } from '../app.types';
import { MINUTE } from '../constants';

const logger = Logger({ className: 'smesherInfo' });

const getRewards$ = (
  managers: Managers,
  coinbase: HexString
): Observable<Reward> =>
  from(managers.wallet.getOldRewardsByCoinbase(coinbase));

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

const getRewardsStream$ = (
  managers: Managers,
  coinbase: HexString
): Observable<Reward> =>
  new Observable<Reward>((subscriber) =>
    managers.wallet.listenRewardsByCoinbase(coinbase, (x) => {
      subscriber.next(toReward(x));
    })
  );

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
  const $smeshingSetupState = new Subject<SmeshingSetupState>();
  const $smeshingStarted = $smeshingSetupState.pipe(
    filter((s) => s !== SmeshingSetupState.Failed)
  );

  const $isLocalNode = $wallet.pipe(
    filter(Boolean),
    map((wallet) => wallet.meta.type === WalletType.LocalNode)
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
  const $coinbase = $isSmeshing.pipe(
    filter(Boolean),
    withLatestFrom($managers, $isLocalNode),
    switchMap(([_, managers, isLocalNode]) =>
      isLocalNode
        ? from(
            managers.smesher.getCoinbase().then((res) => {
              if (!res) return null;
              if (res.error) {
                logger.error('getCoinbase() return', res);
                return null;
              }
              return res.coinbase;
            })
          )
        : of(null)
    ),
    filter(Boolean),
    share()
  );

  const $genesisId = $wallet.pipe(
    filter(Boolean),
    map((wallet) => wallet.meta.genesisID),
    distinctUntilChanged(),
    share()
  );

  const $rewards = combineLatest([$coinbase, $genesisId]).pipe(
    withLatestFrom($managers),
    switchMap(([[coinbase, _], managers]) =>
      concat(
        getRewards$(managers, coinbase),
        getRewardsStream$(managers, coinbase)
      )
    ),
    scan((acc, next) => {
      const key = `${next.layer}$${next.amount}`;
      return acc.set(key, next);
    }, new Map<string, Reward>()),
    map((uniqRewards) => Array.from(uniqRewards.values())),
    shareReplay(1)
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
    $smeshingSetupState,
  };
};

export default syncSmesherInfo;
