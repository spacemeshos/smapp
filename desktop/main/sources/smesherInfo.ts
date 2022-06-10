import * as R from 'ramda';
import {
  combineLatest,
  from,
  map,
  merge,
  Observable,
  of,
  scan,
  Subject,
  switchMap,
} from 'rxjs';
import { Reward__Output } from '../../../proto/spacemesh/v1/Reward';
import { Activation, SmesherReward } from '../../../shared/types';
import { isSmesherReward } from '../../../shared/types/guards';
import { fromHexString } from '../../utils';
import { Managers } from '../app.types';

const getRewards$ = (
  managers: Managers,
  coinbase: Uint8Array
): Observable<Reward__Output> =>
  from(managers.wallet.requestRewardsByCoinbase(coinbase)).pipe(
    switchMap(from)
  );

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
  const $coinbase = combineLatest([$managers, $isWalletActivated]).pipe(
    switchMap(([managers]) =>
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
      (acc, next) => [
        ...acc,
        ...(isSmesherReward(next)
          ? [
              <SmesherReward>{
                layer: next.layer.number,
                layerReward: next.layerReward.value.toNumber(),
                total: next.total.value.toNumber(),
                coinbase: next.coinbase.address,
                smesher: next.smesher.id,
              },
            ]
          : []),
      ],
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
