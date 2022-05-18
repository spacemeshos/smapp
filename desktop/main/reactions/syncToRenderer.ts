import { BrowserWindow } from 'electron';
import * as R from 'ramda';
import { buffer, debounceTime, map, merge, Observable, Subject } from 'rxjs';
import { NodeConfig, Wallet } from '../../../shared/types';
import { ConfigStore } from '../../storeService';
import { Network } from '../context';
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
  ...observables: Observable<any>[]
) => {
  // Merge interested data streams and transform them into required view
  const $updates = merge(...observables);

  // Incremental updates

  // SyncPoint is a point in time that triggers batching updates.
  // So we have incremental state syncing, but to avoid spamming
  // with some intermediary values we batch it.
  const $syncPoint = new Subject<void>();
  // Pack data into a batch
  const $batch = $updates.pipe(
    buffer($syncPoint),
    map((a) => a.reduce(R.mergeRight))
  );
  const subs = [
    // Update the sync point
    $updates.pipe(debounceTime(5)).subscribe(() => $syncPoint.next()),
    // Send updates on changes
    $batch.pipe(withLatest($mainWindow)).subscribe(([mw, batch]) => {
      if (!mw) return;
      mw.webContents.send('IPC_BATCH_SYNC', batch);
    }),
  ];

  return () => subs.forEach((sub) => sub.unsubscribe());
};

export default (
  $mainWindow: Subject<BrowserWindow>,
  $wallet: Subject<Wallet | null>,
  $walletPath: Subject<string>,
  $storeService: Observable<ConfigStore>,
  $currentNetwork: Observable<Network | null>,
  $nodeConfig: Observable<NodeConfig>
) =>
  sync(
    $mainWindow,
    walletView($wallet, $walletPath),
    storeView($storeService),
    networkView($currentNetwork, $nodeConfig)
    // @TODO:
    // Networks + currentLayer + rootHash
    // $.interval(MINUTE)
    //   .pipe(
    //     withLatest($managers),
    //     $.switchMap(([managers, _]) => managers.wallet.getCurrentLayer())
    //   )
    //   .subscribe((next) => {
    //     $currentLayer.next(next.currentLayer);
    //   });
  );
