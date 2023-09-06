import os from 'os';
import { BrowserWindow } from 'electron';
import * as R from 'ramda';
import {
  buffer,
  combineLatest,
  debounceTime,
  distinct,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  of,
  scan,
  shareReplay,
  skipUntil,
  Subject,
  withLatestFrom,
} from 'rxjs';
import parse from 'parse-duration';

import { getEventType } from '../../../shared/utils';
import { epochByLayer, timestampByLayer } from '../../../shared/layerUtils';
import {
  Network,
  NodeConfig,
  NodeVersionAndBuild,
  RewardsInfo,
  Reward,
  Wallet,
  NodeEvent,
} from '../../../shared/types';
import { ConfigStore } from '../../storeService';
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

const sync = (
  $mainWindow: Subject<BrowserWindow>,
  ...observables: Observable<Record<string, any>>[]
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
    map((a) => a.reduce(R.mergeDeepRight, {}))
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
      if (!mw || mw.isDestroyed()) return;
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
      .pipe(withLatestFrom($updates.pipe(scan(R.mergeDeepRight)), $mainWindow))
      .subscribe(([_, state, mw]) => {
        $syncPoint.next(false);
        mw.webContents.send('IPC_BATCH_SYNC', state);
      }),
  ];

  return () => subs.forEach((sub) => sub.unsubscribe());
};

const getRewardsInfo = (
  cfg: NodeConfig,
  curLayer: number,
  rewards: Reward[]
): RewardsInfo => {
  const getLayerTime = timestampByLayer(
    cfg.genesis['genesis-time'],
    parse(cfg.main['layer-duration'])
  );
  const getEpoch = epochByLayer(cfg.main['layers-per-epoch']);
  const curEpoch = getEpoch(curLayer);

  const sums = rewards.reduce(
    (acc, next) => ({
      total: acc.total + next.amount,
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
    R.reduce((acc, next: Reward) => acc + next.amount, 0),
    R.filter((reward: Reward) => getEpoch(reward.layer) === curEpoch)
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

const getNodeEventKey = (e: NodeEvent) => `${e.timestamp}_${getEventType(e)}`;

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
  $smesherId: Observable<string>,
  $rewards: Observable<Reward[]>,
  $nodeEvents: Observable<NodeEvent>,
  $hrp: Observable<string>
) => {
  const $currentNodeConfig = $nodeConfig.pipe(shareReplay(1));

  return sync(
    // Sync to
    $mainWindow,
    // Views
    walletView($wallet, $walletPath, $hrp),
    storeView($storeService),
    networkView($currentNetwork, $currentNodeConfig),
    $networks.pipe(map(R.objOf('networks'))),
    $nodeVersion.pipe(map(R.objOf('node'))),
    $smesherId.pipe(map((smesherId) => ({ smesher: { smesherId } }))),
    $rewards.pipe(map((rewards) => ({ smesher: { rewards } }))),
    $nodeEvents.pipe(
      distinct(getNodeEventKey),
      scan((acc, next) => [...acc, next].slice(-1000), <NodeEvent[]>[]),
      distinctUntilChanged(),
      map((events) => ({ smesher: { events } }))
    ),
    combineLatest([$rewards, $currentNodeConfig, $currentLayer]).pipe(
      map(([rewards, cfg, layer]) => getRewardsInfo(cfg, layer, rewards)),
      map((rewardsInfo) => ({ smesher: { rewardsInfo } }))
    ),
    $currentNodeConfig.pipe(
      map((nodeConfig) => {
        return {
          smesher: {
            postProvingOpts: {
              nonces: R.pathOr(
                0,
                ['smeshing-proving-opts', 'smeshing-opts-proving-nonces'],
                nodeConfig.smeshing
              ),
              threads: R.pathOr(
                0,
                ['smeshing-proving-opts', 'smeshing-opts-proving-threads'],
                nodeConfig.smeshing
              ),
            },
          },
        };
      })
    ),
    $rootHash.pipe(map((rootHash) => ({ network: { rootHash } }))),
    $currentLayer.pipe(map((currentLayer) => ({ network: { currentLayer } }))),
    of({ ui: { osPlatform: os.platform() } })
  );
};
