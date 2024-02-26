import * as $ from 'rxjs';
import { app } from 'electron';
import Bech32 from '@spacemesh/address-wasm';

import HRP from '../../shared/hrp';
import {
  NetworkExtended,
  NodeConfig,
  NodeVersionAndBuild,
  Wallet,
} from '../../shared/types';
import { shallowEq } from '../../shared/utils';
import Warning from '../../shared/warning';
import StoreService from '../storeService';
import AutoStartManager from '../AutoStartManager';
import createMainWindow from './createMainWindow';
import observeStoreService from './sources/storeService';
import {
  fetchDiscovery,
  fetchDiscoveryEvery,
  listPublicApisByRequest,
  listNetworksByRequest,
  listenNodeConfigAndRestartNode,
} from './sources/fetchDiscovery';
import spawnManagers from './reactions/spawnManagers';
import syncNodeConfig from './reactions/syncNodeConfig';
import activateWallet from './reactions/activateWallet';
import ensureNetwork from './reactions/ensureNetwork';
import handleCloseApp from './reactions/handleCloseApp';
import handleWalletIpcRequests from './sources/wallet.ipc';
import syncToRenderer from './reactions/syncToRenderer';
import currentNetwork from './sources/currentNetwork';
import { AppStore, Managers } from './app.types';
import handleAutoUpdates from './sources/autoUpdate';
import getSmesherInfo from './sources/smesherInfo';
import handleSmesherIpc from './reactions/handleSmesherIpc';
import handleShowFile from './reactions/handleShowFile';
import handleOpenDashboard from './reactions/handleOpenDashboard';
import nodeIPCStreams from './sources/node.ipc';
import handleWipeOut from './reactions/wipeOut.ipc';
import handleDeleteWalletFile from './reactions/deleteWalletFile.ipc';
import handleAppWalletChange from './reactions/handleAppWalletChange';
import handleNodeAutoStart from './reactions/handleNodeAutoStart';
import { collectWarnings, sendWarningsToRenderer } from './reactions/warnings';
import handleBenchmarksIpc from './reactions/handlePosBenchmarks.ipc';
import handleUpdateSmesherProvingOptsIpc from './reactions/handleUpdateSmesherProvingOptsIpc';
import ensureProvingOpts from './reactions/ensureProvingOpts';
import syncAutoStartAndConfig from './reactions/syncAutoStartAndConfig';
import restartNode from './reactions/restartNode';
import { updateConfigHash } from './configHash';
import { ensureConfigCacheDir } from './fallbackConfigs';

const positiveNum = (def: number, n: number) => (n > 0 ? n : def);

const CHECK_UPDATES_INTERVAL =
  positiveNum(
    3600, // hour
    parseInt(
      process.env.CHECK_INTERVAL ||
        app.commandLine.getSwitchValue('check-interval') ||
        '0',
      10
    )
  ) * 1000;

const loadNetworkData = () => {
  const $managers = new $.Subject<Managers>();
  const $currentLayer = new $.BehaviorSubject<number>(-1);
  const $rootHash = new $.BehaviorSubject<string>('');
  const $nodeVersion = new $.BehaviorSubject<NodeVersionAndBuild>({
    version: '',
    build: '',
  });

  const $isWalletActivated = new $.Subject<void>();

  const $nodeStatus = $isWalletActivated.pipe(
    $.withLatestFrom($managers),
    $.switchMap(([_, managers]) => managers.node.$nodeStatus),
    $.distinctUntilChanged(shallowEq)
  );

  const updateInfo = $isWalletActivated
    .pipe(
      $.withLatestFrom($managers),
      $.switchMap(([_, managers]) =>
        $.from(
          Promise.all([
            managers.wallet.getCurrentLayer(),
            managers.wallet.getRootHash(),
            managers.node.getVersionAndBuild(),
          ])
        )
      ),
      $.startWith([
        { currentLayer: 0 },
        { layer: 0, rootHash: '' },
        { version: '', build: '' },
      ] as const)
    )
    .subscribe(([currentLayer, rootHash, nodeVersion]) => {
      $currentLayer.next(currentLayer.currentLayer);
      $rootHash.next(rootHash.rootHash);
      $nodeVersion.next(nodeVersion);
    });

  const currentLayerSub = $nodeStatus
    .pipe(
      $.map((status) => status.syncedLayer),
      $.distinctUntilChanged()
    )
    .subscribe((currentLayer) => $currentLayer.next(currentLayer));

  const unsubscribe = () => {
    updateInfo.unsubscribe();
    currentLayerSub.unsubscribe();
  };

  return {
    $managers,
    $currentLayer,
    $rootHash,
    $nodeVersion,
    $nodeStatus,
    $isWalletActivated,
    unsubscribe,
  };
};

const startApp = (): AppStore => {
  // Create MainWindow
  const {
    $mainWindow,
    $quit,
    $isAppClosing,
    $showWindowOnLoad,
    $isWindowReady,
  } = createMainWindow();
  // Store
  const $storeService = observeStoreService();

  // Data
  const $wallet = new $.BehaviorSubject<Wallet | null>(null);
  const $walletPath = new $.BehaviorSubject<string>('');
  const $networks = new $.BehaviorSubject<NetworkExtended[]>([]);
  const $nodeConfig = new $.Subject<NodeConfig>();
  const $hrp = $nodeConfig.pipe(
    $.map((c) => c.main['network-hrp'] ?? HRP.MainNet),
    $.startWith(HRP.MainNet),
    $.distinctUntilChanged(),
    $.tap((hrp) => Bech32.setHRPNetwork(hrp))
  );
  const $warnings = new $.Subject<Warning>();
  const startNodeAfterUpdate = StoreService.get('startNodeOnNextLaunch');
  const $runNodeBeforeLogin = new $.BehaviorSubject<boolean>(
    AutoStartManager.isEnabledFromConfig() || startNodeAfterUpdate
  );

  const {
    $managers,
    $currentLayer,
    $rootHash,
    $nodeVersion,
    $isWalletActivated,
  } = loadNetworkData();

  const {
    $smesherId,
    $smeshingStarted,
    $smeshingSetupState,
    $nodeEvents,
  } = getSmesherInfo($managers, $isWalletActivated, $wallet, $nodeConfig);

  const { $nodeRestartRequest } = nodeIPCStreams();

  const $currentNetwork = currentNetwork(
    $runNodeBeforeLogin,
    $wallet,
    $networks
  );

  ensureConfigCacheDir();

  // Reactions
  // List of unsubscribe functions
  const unsubs = [
    // Spawn managers (and handle unsubscribing)
    spawnManagers($nodeConfig, $managers, $mainWindow),
    // On changing network -> update node config
    syncNodeConfig(
      $currentNetwork,
      $nodeConfig,
      $smeshingSetupState,
      $warnings
    ),
    // Update config hash on changing network
    updateConfigHash($currentNetwork),
    // Restart the node & re-emit wallet if User requested restart
    restartNode($nodeRestartRequest, $managers, $wallet),
    // Activate wallet and accounts
    activateWallet($wallet, $managers, $mainWindow, $isWalletActivated),
    // When silent mode enabled, and smeshing-start: true in node-config
    handleNodeAutoStart($runNodeBeforeLogin, $wallet, $managers),
    // Each time when Smapp is activated (window reloaded and shown)...
    handleAppWalletChange($isWalletActivated, $wallet, $managers),
    // Update currentLayer & rootHash
    // Update networks on init
    fetchDiscovery($networks, $warnings),
    // Update networks each N seconds
    fetchDiscoveryEvery(CHECK_UPDATES_INTERVAL, $networks, $warnings),
    // And update them by users request
    listNetworksByRequest($networks, $warnings),
    // List Public APIs for current network
    // Do not update anything
    listPublicApisByRequest($wallet, $warnings),
    // If current network does not exist in discovery service
    // then ask User to switch the network
    ensureNetwork($wallet, $networks, $mainWindow),
    // Handle closing App
    handleCloseApp(
      $quit,
      $managers,
      $mainWindow,
      $isAppClosing,
      $showWindowOnLoad
    ),
    // Unlock / Create wallet
    // Switch network
    // Add account, manage contacts
    // Close wallet
    handleWalletIpcRequests(
      $wallet,
      $walletPath,
      $networks,
      $smeshingStarted,
      $warnings
    ),
    // Ensure smeshing-proving-opts settings valid and exists in the node-config file
    ensureProvingOpts($wallet, $nodeConfig, $warnings),
    // Handle Start Smeshing request
    handleSmesherIpc($managers, $smeshingSetupState),
    // Handle show file
    handleShowFile($currentNetwork),
    // IPC Reactions
    handleWipeOut($mainWindow, $isAppClosing),
    handleDeleteWalletFile($mainWindow, $wallet, $walletPath),
    // Handle update smeshing-proving-opts settings from GUI
    handleUpdateSmesherProvingOptsIpc($managers, $nodeConfig),
    // Push updates to Renderer process (redux via IPC)
    syncToRenderer(
      $mainWindow,
      $wallet,
      $walletPath,
      $storeService,
      $networks,
      $currentNetwork,
      $nodeConfig,
      $currentLayer,
      $rootHash,
      $nodeVersion,
      $smesherId,
      $nodeEvents,
      $hrp
    ),
    // Subscribe on AutoUpdater events
    // and handle IPC communications with it
    handleAutoUpdates(
      CHECK_UPDATES_INTERVAL,
      $mainWindow,
      $managers,
      $currentNetwork
    ),
    handleOpenDashboard($mainWindow, $currentNetwork),
    sendWarningsToRenderer($warnings, $mainWindow, $isWindowReady),
    collectWarnings($managers, $warnings),
    listenNodeConfigAndRestartNode($nodeConfig, $managers),
    handleBenchmarksIpc($mainWindow, $nodeConfig),
    syncAutoStartAndConfig($warnings),
  ];

  return {
    get: () =>
      $.firstValueFrom(
        $.combineLatest({
          wallet: $wallet,
          walletPath: $walletPath,
          networks: $networks,
          currentNetwork: $currentNetwork,
          nodeConfig: $nodeConfig,
          managers: $managers,
        })
      ),
    unsubscribe: () => unsubs.forEach((unsub) => (unsub as () => void)()),
    subjects: {
      $networks,
    },
  };
};

export default startApp;
