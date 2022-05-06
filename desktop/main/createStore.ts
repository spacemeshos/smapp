import * as R from 'ramda';
import * as $ from 'rxjs';
import { Wallet } from '../../shared/types';
import { ipcConsts } from '../../app/vars';
import { ifTruish, isWalletOnlyType, remap } from '../../shared/utils';
import {
  createIpcResponse,
  CreateWalletRequest,
  CreateWalletResponse,
  UnlockWalletRequest,
  UnlockWalletResponse,
} from '../../shared/ipcMessages';
import Logger from '../logger';
import { Network } from './context';
import { loadWallet, updateWalletMeta } from './walletFile';
import {
  fetchNetworksFromDiscovery,
  Managers,
  spawnManagers,
} from './Networks';
import { fromIPC, handleIPC, withLatest, withPreviousItem } from './rx.utils';
import { MINUTE } from './constants';
import { createWallet } from './Wallet';
import { downloadNodeConfig } from './NodeConfig';
import { checkUpdates } from './autoUpdate';
import createMainWindow from './createMainWindow';
import promptBeforeClose from './promptBeforeClose';
import observeStoreService from './sources/storeService';

const logger = Logger({ className: 'ReactiveStore' });

const startApp = () => {
  // Create MainWindow
  const {
    $mainWindow,
    $quit,
    $isAppClosing,
    $showWindowOnLoad,
  } = createMainWindow();
  // Store
  const $storeService = observeStoreService();

  // Data
  const $wallet = new $.BehaviorSubject<Wallet | null>(null);
  const $walletPath = new $.BehaviorSubject<string>('');
  const $networks = new $.BehaviorSubject<Network[]>([]);
  const fetchDiscovery = () =>
    $.from(fetchNetworksFromDiscovery())
      .pipe(
        $.retry(3),
        $.delay(200),
        $.catchError(() => $.of([]))
      )
      .subscribe((nets) => $networks.next(nets));
  const $currentNetwork = $.combineLatest([$wallet, $networks]).pipe(
    $.map(
      ([wallet, networks]) =>
        R.find((net) => net.netID === wallet?.meta.netId, networks) || null
    )
  );
  const $nodeConfig = new $.Subject<Record<string, any>>();
  const $managers = new $.Subject<Managers>();
  // @TODO:
  // const $currentLayer = new $.Subject<number>();

  // If node config changed, then unsubscribe managers
  $nodeConfig
    .pipe($.skip(1), $.withLatestFrom($managers))
    .subscribe(([_, managers]) => {
      if (managers) {
        managers.wallet?.unsubscribe();
        managers.smesher?.unsubscribe();
        managers.node?.unsubscribe();
      }
    });
  // And then spawn new managers
  $nodeConfig
    .pipe($.delay(1), withLatest($mainWindow))
    .subscribe(([mw, nodeConfig]) => {
      if (!mw) return;
      const netId: number = nodeConfig.p2p['network-id'];
      spawnManagers(mw, netId)
        .then((nextManagers) => $managers.next(nextManagers))
        .catch((err) =>
          logger.error('Can not spawn new managers:', err, netId)
        );
    });

  // On changing network -> update node config
  $currentNetwork
    .pipe($.distinctUntilChanged(), withLatest($mainWindow))
    .subscribe(async ([mw, net]) => {
      if (!net) return;
      const config = await downloadNodeConfig(net);
      $nodeConfig.next(config);
      mw && checkUpdates(mw, net);
    });
  // On new node config -> respawn managers (GRPC clients)
  // $managers.subscribe(() => console.log('managers spawned!'));
  // Activate wallet and accounts
  $.combineLatest([$wallet, $managers]).subscribe(
    async ([wallet, managers]) => {
      if (!wallet) return;
      await managers.wallet.activate(wallet);
      managers.wallet.activateAccounts(wallet.crypto.accounts);
    }
  );

  // @TODO
  // Networks + currentLayer + rootHash
  // $.interval(MINUTE)
  //   .pipe(
  //     withLatest($managers),
  //     $.switchMap(([managers, _]) => managers.wallet.getCurrentLayer())
  //   )
  //   .subscribe((next) => {
  //     $currentLayer.next(next.currentLayer);
  //   });

  // Side-effects

  // On init
  // Update networks
  fetchDiscovery();
  // And then update it each N minutes
  $.interval(60 * MINUTE).subscribe(fetchDiscovery);

  // IPC Requests
  type WalletPair = { path: string; wallet: Wallet | null };
  const walletPair = (path, wallet): WalletPair => ({ path, wallet });

  const handleNewWalletPair = async (next: WalletPair) => {
    $wallet.next(next.wallet);
    $walletPath.next(next.path);
  };
  const updateWalletFile = async (next: WalletPair) => {
    if (!next.wallet) return;
    updateWalletMeta(next.path, next.wallet.meta).catch((err) =>
      logger.error(`Can not update walletMeta by path: ${next.path}`, err)
    );
  };

  const ipcRequests = $.merge(
    //
    handleIPC(
      ipcConsts.W_M_UNLOCK_WALLET,
      ({ path, password }: UnlockWalletRequest) =>
        $.from(
          loadWallet(path, password).then((wallet) => ({
            pair: walletPair(path, wallet),
            error: null,
          }))
        ).pipe(
          $.catchError((error: Error) =>
            $.of({ pair: walletPair('', null), error })
          )
        ),
      ({ pair, error }): UnlockWalletResponse =>
        createIpcResponse(error, pair?.wallet?.meta)
    ).pipe($.map(({ pair }) => pair)),
    //
    handleIPC(
      ipcConsts.W_M_CREATE_WALLET,
      (data: CreateWalletRequest) => $.from(createWallet(data)),
      ({ path }): CreateWalletResponse => createIpcResponse(null, { path })
    ),
    //
    fromIPC<number>(ipcConsts.SWITCH_NETWORK).pipe(
      $.switchMap((netId) =>
        $.combineLatest([$.of(netId), $wallet, $walletPath, $networks])
      ),
      $.first(),
      $.switchMap(([netId, wallet, path, nets]) => {
        if (nets.length === 0)
          return $.throwError(() => Error('No networks to switch on'));
        if (!wallet) return $.throwError(() => Error('No opened wallet'));

        const selectedNet = nets.find((net) => net.netID === netId);
        if (!selectedNet) return $.throwError(() => Error('No network found'));

        return $.of(
          walletPair(path, R.assocPath(['meta', 'netId'], netId, wallet))
        );
      }),
      $.retry(3),
      $.delay(1000),
      $.catchError(() => $.of(walletPair('', null)))
    )
  );
  // Update wallet in state
  ipcRequests.subscribe(handleNewWalletPair);
  // Store new wallet on FS
  ipcRequests
    .pipe($.skip(1), withPreviousItem())
    .subscribe(({ previous, current }) => {
      if (previous === current) return;
      updateWalletFile(current);
    });

  //
  // Side-effects
  //

  // If current network does not exist in discovery service
  // then ask User to switch the network
  $.combineLatest([$wallet.pipe($.filter(Boolean)), $networks, $currentNetwork])
    .pipe($.debounceTime(20), withLatest($mainWindow))
    .subscribe(([mw, [wallet, nets, curNet]]) => {
      if (mw && !curNet && nets.length > 0) {
        mw.webContents.send('REQUEST_SWITCH_NETWORK', {
          isWalletOnly: wallet ? isWalletOnlyType(wallet.meta.type) : false,
        });
      }
    });

  // Handle closing App
  $quit
    .pipe(withLatest($mainWindow), $.withLatestFrom($managers))
    .subscribe(([[mw, event], managers]) => {
      mw &&
        promptBeforeClose(
          mw,
          managers || {},
          $isAppClosing,
          $showWindowOnLoad
        )(event).catch((err) =>
          logger.error('Error in prompt before close:', err)
        );
    });

  //
  // Sync to Renderer
  //
  // Have two mechanisms:
  // 1. Send incremental updates as it changes on the main process.
  // 2. [NOT IMPLEMENTED] Send the entire state to the renderer when window reloaded / activated / etc

  // Merge interested data streams and transform them into required view
  const updates$ = $.merge(
    $.combineLatest([$wallet, $walletPath] as const).pipe(
      $.map(([wallet, currentWalletPath]) =>
        R.mergeLeft(
          ifTruish(
            wallet,
            remap({
              meta: ['meta'],
              mnemonic: ['crypto', 'mnemonic'],
              accounts: ['crypto', 'accounts'],
              contacts: ['crypto', 'contacts'],
            }),
            {} as Record<string, string>
          ),
          { currentWalletPath }
        )
      ),
      $.map(R.objOf('wallet'))
    ),
    $storeService.pipe(
      $.map(
        remap({
          dataPath: ['node', 'dataPath'],
          port: ['node', 'port'],
        })
      ),
      $.map(R.objOf('store'))
    ),
    $.combineLatest([$currentNetwork, $nodeConfig]).pipe(
      $.map(([curNet, nodeConfig]) => ({
        netId: curNet?.netID || -1,
        netName: curNet?.netName || 'Not connected',
        genesisTime: nodeConfig.main['genesis-time'],
        layerDurationSec: nodeConfig.main['layer-duration-sec'],
        explorerUrl: curNet?.explorer || '',
      })),
      $.map(R.objOf('network'))
    )
    // $networks.pipe($.map(R.objOf('networks'))),
    // $nodeStatus.pipe($.map(R.objOf('nodeStatus'))),
    // $currentNetwork.pipe($.map(R.objOf('currentNetwork'))),
    // $nodeConfig.pipe($.map(R.objOf('nodeConfig')))
  );

  // Incremental updates

  // SyncPoint is a point in time that triggers batching updates.
  // So we have incremental state syncing, but to avoid spamming
  // with some intermediary values we batch it.
  const syncPoint$ = new $.Subject<void>();
  // Update the sync point
  updates$.pipe($.debounceTime(5)).subscribe(() => syncPoint$.next());
  // Pack data into a batch
  const batch$ = updates$.pipe(
    $.buffer(syncPoint$),
    $.map((a) => a.reduce(R.mergeRight))
  );
  // Send updates on changes
  batch$.pipe(withLatest($mainWindow)).subscribe(([mw, batch]) => {
    if (!mw) return;
    mw.webContents.send('IPC_BATCH_SYNC', batch);
  });

  // TODO: Entire update

  return {
    get: () =>
      $.firstValueFrom(
        $.combineLatest({
          $wallet,
          $walletPath,
          $networks,
          $currentNetwork,
          $nodeConfig,
          $managers,
        })
      ),
    networks: $networks,
  };
};

export default startApp;
