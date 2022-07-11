import { BrowserWindow } from 'electron';
import * as R from 'ramda';
import {
  buffer,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  scan,
  skipUntil,
  startWith,
  Subject,
  withLatestFrom,
} from 'rxjs';
import { epochByLayer, timestampByLayer } from '../../../shared/layerUtils';
import {
  Activation,
  Network,
  NodeConfig,
  NodeVersionAndBuild,
  RewardsInfo,
  SmesherReward,
  Wallet,
} from '../../../shared/types';
import { ConfigStore } from '../../storeService';
import { toHexString } from '../../utils';
import { HOUR, MINUTE } from '../constants';
import { withLatest } from '../rx.utils';
import networkView from './views/networkView';
import storeView from './views/storeView';
import walletView from './views/walletView';

//
// Sync to Renderer
//
// Have two mechanisms:
// 1. Send incremental updates as it changes on the main process.
// 2. [NOT IMPLEMENTED] Send the entire state to the renderer when window reloaded / activated / etc

const sync = <T extends any>(
  $mainWindow: Subject<BrowserWindow>,
  ...observables: Observable<Record<string, T>>[]
) => {
  // Merge interested data streams and transform them into required view
  const $updates = merge(
    ...observables.map((o) => o.pipe(distinctUntilChanged()))
  );

  // Incremental updates

  // SyncPoint is a point in time that triggers batching updates.
  // So we have incremental state syncing, but to avoid spamming
  // with some intermediary values we batch it.
  //
  // Value of Subjects stands for skipping batch update.
  // Set to false to move pointer without sending updates.
  const $syncPoint = new Subject<boolean>();
  // Pack data into a batch
  const $batch = $updates.pipe(
    buffer($syncPoint.pipe(filter(Boolean))),
    map((a) => a.reduce(R.mergeRight, {}))
  );

  // Whole state sync
  const $isWindowEager = new Subject<void>();

  let blured = 0;
  const subs = [
    // Update the sync point
    $updates
      .pipe(skipUntil($isWindowEager), debounceTime(5))
      .subscribe(() => $syncPoint.next(true)),
    // Send updates on changes
    $batch.pipe(withLatest($mainWindow)).subscribe(([mw, batch]) => {
      if (!mw) return;
      mw.webContents.send('IPC_BATCH_SYNC', batch);
    }),
    // When window is ready or want update — update the Subject
    $mainWindow.subscribe((mw) => {
      mw.on('ready-to-show', () => $isWindowEager.next());
      mw.on('blur', () => {
        blured = Date.now();
      });
      mw.on('focus', () => {
        if (blured === 0) return;
        const willResync = Date.now() - blured >= 2 * MINUTE;
        if (willResync) {
          $isWindowEager.next();
        }
        blured = 0;
      });
    }),
    // Send the entire actual state
    $isWindowEager
      .pipe(
        withLatestFrom(
          $updates.pipe(scan((acc, next) => ({ ...acc, ...next })))
        ),
        withLatestFrom($mainWindow)
      )
      .subscribe(([[_, state], mw]) => {
        $syncPoint.next(false);
        mw.webContents.send('IPC_BATCH_SYNC', state);
      }),
  ];

  return () => subs.forEach((sub) => sub.unsubscribe());
};

const getRewardsInfo = (
  cfg: NodeConfig,
  curLayer: number,
  rewards: SmesherReward[]
): RewardsInfo => {
  const getLayerTime = timestampByLayer(
    cfg.main['genesis-time'],
    cfg.main['layer-duration-sec']
  );
  const getEpoch = epochByLayer(cfg.main['layers-per-epoch']);
  const curEpoch = getEpoch(curLayer);

  const sums = rewards.reduce(
    (acc, next) => ({
      total: acc.total + next.total,
      layers: new Set(acc.layers).add(next.layer),
      epochs: new Set(acc.epochs).add(getEpoch(next.layer)),
    }),
    {
      total: 0,
      layers: new Set(),
      epochs: new Set(),
    }
  );

  const lastEpoch = R.compose(
    R.reduce((acc, next: SmesherReward) => acc + next.total, 0),
    R.filter((reward: SmesherReward) => getEpoch(reward.layer) === curEpoch)
  )(rewards);

  const dailyAverage =
    rewards.length > 2
      ? (sums.total /
          (getLayerTime(rewards[rewards.length - 1].layer) -
            getLayerTime(rewards[0].layer))) *
        (24 * HOUR)
      : 0;

  return {
    total: sums.total,
    lastEpoch,
    layers: sums.layers.size,
    epochs: sums.epochs.size,
    dailyAverage,
  };
};

export default (
  $mainWindow: Subject<BrowserWindow>,
  $wallet: Subject<Wallet | null>,
  $walletPath: Subject<string>,
  $storeService: Observable<ConfigStore>,
  $networks: Subject<Network[]>,
  $currentNetwork: Observable<Network | null>,
  $nodeConfig: Observable<NodeConfig>,
  $currentLayer: Observable<number>,
  $rootHash: Observable<string>,
  $nodeVersion: Observable<NodeVersionAndBuild>,
  $smesherId: Observable<Uint8Array>,
  $activations: Observable<Activation[]>,
  $rewards: Observable<SmesherReward[]>
) =>
  sync(
    // Sync to
    $mainWindow,
    // Views
    walletView($wallet, $walletPath),
    storeView($storeService),
    networkView($currentNetwork, $nodeConfig, $currentLayer, $rootHash),
    $networks.pipe(map(R.objOf('networks'))),
    $nodeVersion.pipe(map(R.objOf('node'))),
    combineLatest([
      $smesherId,
      $rewards.pipe(startWith([])),
      $activations.pipe(startWith([])),
      $nodeConfig,
      $currentLayer,
    ]).pipe(
      map(([smesherId, rewards, activations, cfg, curLayer]) => ({
        smesher: {
          smesherId: toHexString(smesherId),
          activations,
          rewards,
          rewardsInfo: getRewardsInfo(cfg, curLayer, rewards),
        },
      }))
    )
  );
