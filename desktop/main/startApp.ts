import * as $ from 'rxjs';
import {
  Network,
  NodeConfig,
  NodeVersionAndBuild,
  Wallet,
} from '../../shared/types';
import { shallowEq } from '../../shared/utils';
import Warning from '../../shared/warning';
import StoreService from '../storeService';
import { IS_AUTO_START_ENABLED } from '../AutoStartManager';
import { MINUTE } from './constants';
import createMainWindow from './createMainWindow';
import observeStoreService from './sources/storeService';
import {
  fetchDiscovery,
  fetchDiscoveryEach,
  listPublicApisByRequest,
  listNetworksByRequest,
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
import nodeIPCStreams, { sentryLogsListener } from './sources/node.ipc';
import handleWipeOut from './reactions/wipeOut.ipc';
import handleDeleteWalletFile from './reactions/deleteWalletFile.ipc';
import handleAppWalletChange from './reactions/handleAppWalletChange';
import handleNodeAutoStart from './reactions/handleNodeAutoStart';
import { collectWarnings, sendWarningsToRenderer } from './reactions/warnings';

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
  } = createMainWindow();
  // Store
  const $storeService = observeStoreService();

  // Data
  const $wallet = new $.BehaviorSubject<Wallet | null>(null);
  const $walletPath = new $.BehaviorSubject<string>('');
  const $networks = new $.BehaviorSubject<Network[]>([]);
  const $nodeConfig = new $.Subject<NodeConfig>();
  const $warnings = new $.Subject<Warning>();
  const startNodeAfterUpdate = StoreService.get('startNodeOnNextLaunch');
  const $runNodeBeforeLogin = new $.BehaviorSubject<boolean>(
    StoreService.get(IS_AUTO_START_ENABLED) || startNodeAfterUpdate
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
    $activations,
    $rewards,
    $smeshingStarted,
    $smeshingSetupState,
  } = getSmesherInfo($managers, $isWalletActivated, $wallet);

  const { $nodeRestartRequest } = nodeIPCStreams();

  const $currentNetwork = currentNetwork(
    $runNodeBeforeLogin,
    $wallet,
    $networks
  );

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
    // Activate wallet and accounts
    activateWallet(
      $wallet,
      $managers,
      $isWalletActivated,
      $mainWindow,
      $nodeRestartRequest
    ),
    // When silent mode enabled, and smeshing-start: true in node-config
    handleNodeAutoStart($runNodeBeforeLogin, $wallet, $managers),
    // Each time when Smapp is activated (window reloaded and shown)...
    handleAppWalletChange($isWalletActivated, $wallet, $managers),
    // Update currentLayer & rootHash
    // Update networks on init
    fetchDiscovery($networks),
    // Update networks each N seconds
    fetchDiscoveryEach(60 * MINUTE, $networks),
    // And update them by users request
    listNetworksByRequest($networks),
    // Get actual logs to client app
    sentryLogsListener(),
    // List Public APIs for current network
    // Do not update anything
    listPublicApisByRequest($wallet),
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
    // Handle Start Smeshing request
    handleSmesherIpc($managers, $smeshingSetupState),
    // Handle show file
    handleShowFile($currentNetwork),
    // IPC Reactions
    handleWipeOut($mainWindow, $isAppClosing),
    handleDeleteWalletFile($mainWindow, $wallet, $walletPath),
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
      $activations,
      $rewards
    ),
    // Subscribe on AutoUpdater events
    // and handle IPC communications with it
    handleAutoUpdates($mainWindow, $managers, $currentNetwork),
    handleOpenDashboard($mainWindow, $currentNetwork),
    collectWarnings($managers, $warnings),
    sendWarningsToRenderer($warnings, $mainWindow),
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
