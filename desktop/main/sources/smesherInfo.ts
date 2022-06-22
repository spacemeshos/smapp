import {
  combineLatest,
  concat,
  filter,
  from,
  interval,
  map,
  merge,
  Observable,
  of,
  scan,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { Reward__Output } from '../../../proto/spacemesh/v1/Reward';
import { Activation, PostSetupOpts, SmesherReward } from '../../../shared/types';
import { hasRequiredRewardFields } from '../../../shared/types/guards';
import Logger from '../../logger';
import { fromHexString } from '../../utils';
import { Managers } from '../app.types';
import { MINUTE } from '../constants';
import { handleIPC, wrapResult } from '../rx.utils';

const logger = Logger({ className: 'smesherInfo' });

const getRewards$ = (
  managers: Managers,
  coinbase: Uint8Array
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
  coinbase: Uint8Array
): Observable<Activation[]> =>
  from(managers.wallet.requestActivationsByCoinbase(coinbase));

const syncSmesherInfo = (
  $managers: Observable<Managers>,
  $isWalletActivated: Subject<void>
) => {
  // IPC
  const $startSmeshing = handleIPC(
    ipcConsts.SMESHER_START_SMESHING,
    (postSetupOpts: PostSetupOpts) =>
      of(postSetupOpts).pipe(
        withLatestFrom($managers),
        switchMap(([opts, managers]) =>
          from(wrapResult(managers.node.startSmeshing(opts)))
        )
      ),
    (x) => x
  );

  const $isSmeshing = merge(
    $isWalletActivated,
    $startSmeshing.pipe(filter(Boolean)),
    interval(5 * MINUTE)
  ).pipe(
    withLatestFrom($managers),
    switchMap(([_, managers]) => from(managers.smesher.isSmeshing()))
  );

  const $smesherId = combineLatest([$managers, $isWalletActivated]).pipe(
    switchMap(([managers]) =>
      from(
        (async () => {
          if (await managers.node.getNodeStatus(60)) {
            const smesherId = managers.smesher.getSmesherId();
            return smesherId;
          }
          throw new Error('getSmesherId(): Can not reach the Node');
        })()
      )
    ),
    map((pubKey) => fromHexString(pubKey.substring(2)))
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
    switchMap(([coinbase, managers]) =>
      getRewards$(managers, fromHexString(coinbase.substring(2)))
    ),
    map((rewards) => rewards.map(toSmesherReward))
  );
  const $rewardsStream = combineLatest([$coinbase, $managers]).pipe(
    switchMap(
      ([coinbase, managers]) =>
        new Observable<Reward__Output>((subscriber) =>
          managers.wallet.listenRewardsByCoinbase(
            fromHexString(coinbase.substring(2)),
            (x) => subscriber.next(x)
          )
        )
    )
  );

  const $rewards = concat(
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
    switchMap(
      ([coinbase, managers]) =>
        new Observable<Activation>((subscriber) =>
          managers.wallet.listenActivationsByCoinbase(
            fromHexString(coinbase.substring(2)),
            (atx) => subscriber.next(atx)
          )
        )
    )
  );

  const $activations = combineLatest([$coinbase, $managers]).pipe(
    switchMap(([coinbase, managers]) =>
      concat(
        getActivations$(managers, fromHexString(coinbase.substring(2))),
        $activationsStream.pipe(
          scan<Activation, Activation[]>((acc, next) => [...acc, next], [])
        )
      )
    )
  );

  return {
    $smesherId,
    $activations,
    $rewards,
    $coinbase,
  };
};

export default syncSmesherInfo;
