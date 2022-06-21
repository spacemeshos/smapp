import { identity } from 'ramda';
import {
  combineLatest,
  concat,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  from,
  interval,
  map,
  merge,
  Observable,
  of,
  reduce,
  retry,
  scan,
  skipUntil,
  Subject,
  switchMap,
  take,
  tap,
  throttleTime,
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

// TODO: Use it when API will be ready.
//       See also https://github.com/spacemeshos/go-spacemesh/issues/2064
// const getActivations$ = (
//   managers: Managers,
//   coinbase: Uint8Array
// ): Observable<Activation> =>
//   from(managers.wallet.requestActivationsByCoinbase(coinbase)).pipe(
//     switchMap(from)
//   );

const syncSmesherInfo = (
  $managers: Observable<Managers>,
  $isWalletActivated: Subject<void>
) => {
  // IPC
  const $startSmeshing = handleIPC(
    ipcConsts.SMESHER_START_SMESHING,
    (postSetupOpts: PostSetupOpts) =>
      $managers.pipe(
        tap(() => console.log('$startSmeshing triggered...')),
        switchMap((managers) =>
          from(wrapResult(managers.node.startSmeshing(postSetupOpts)))
        )
      ),
    (x) => {
      console.log('$startSmeshing = ', x);
      return x;
    }
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
    take(1),
    switchMap(([coinbase, managers]) =>
      getRewards$(managers, fromHexString(coinbase.substring(2)))
    ),
    map((rewards) => rewards.map(toSmesherReward))
  );
  const $rewardsStream = combineLatest([$coinbase, $managers]).pipe(
    take(1),
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

  // TODO: Use it when API will be ready.
  //       See also https://github.com/spacemeshos/go-spacemesh/issues/2064
  // TODO: coinbases is a list of addresses:
  //       smesher coinbase from node config
  //       and also any other coinbases if any found in rewards log
  // const $activations = combineLatest([$coinbases, $managers]).pipe(
  //   switchMap(([coinbases, managers]) =>
  //     merge(
  //       ...(coinbases.map((coinbase) => {
  //          return [
  //            getActivations$(managers, smesherId);
  //            new Observable<Activation>((subscriber) =>
  //               managers.wallet.listenActivationsByCoinbase(smesherId, subscriber.next),
  //          ];
  //       }))
  //     )
  //   ),
  //   reduce<Activation, Activation[]>((acc, next) => [...acc, next], [])
  // );

  return {
    $smesherId,
    $activations: of(<Activation[]>[]),
    $rewards,
    $coinbase,
  };
};

export default syncSmesherInfo;
