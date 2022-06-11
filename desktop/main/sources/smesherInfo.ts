import {
  combineLatest,
  from,
  map,
  merge,
  Observable,
  of,
  scan,
  skipUntil,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Reward__Output } from '../../../proto/spacemesh/v1/Reward';
import { Activation, SmesherReward } from '../../../shared/types';
import { hasRequiredRewardFields } from '../../../shared/types/guards';
import { fromHexString } from '../../utils';
import { Managers } from '../app.types';

const getRewards$ = (
  managers: Managers,
  coinbase: Uint8Array
): Observable<Reward__Output> =>
  from(managers.wallet.requestRewardsByCoinbase(coinbase)).pipe(
    switchMap(from)
  );

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
  const $coinbase = $isWalletActivated.pipe(
    withLatestFrom($managers),
    switchMap(([_, managers]) =>
      from(
        managers.smesher.getCoinbase().then((res) => {
          if (res.error) {
            throw res.error;
          }
          return fromHexString(res.coinbase.substring(2));
        })
      )
    )
  );

  const $rewards = combineLatest([$coinbase, $managers]).pipe(
    switchMap(([coinbase, managers]) =>
      merge(
        getRewards$(managers, coinbase),
        new Observable<Reward__Output>((subscriber) =>
          managers.wallet.listenRewardsByCoinbase(coinbase, (x) =>
            subscriber.next(x)
          )
        )
      )
    ),
    scan<Reward__Output, SmesherReward[]>(
      (acc, next) =>
        hasRequiredRewardFields(next) ? [...acc, toSmesherReward(next)] : acc,
      []
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
