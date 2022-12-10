import * as $ from 'rxjs';
// import { captureException } from '@sentry/electron/main';
import {
  Network,
  NodeConfig,
  NodeVersionAndBuild,
  Wallet,
} from '../../shared/types';
import { isLocalNodeType } from '../../shared/utils';
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
import observeAutoUpdates from './sources/autoUpdate';
import getSmesherInfo from './sources/smesherInfo';
import handleSmesherIpc from './reactions/handleSmesherIpc';
import handleShowFile from './reactions/handleShowFile';
import handleOpenDashboard from './reactions/handleOpenDashboard';
import { makeSubscription } from './rx.utils';
import nodeIPCStreams from './sources/node.ipc';

const loadNetworkData = () => {
  const $managers = new $.Subject<Managers>();
  const $currentLayer = new $.BehaviorSubject<number>(-1);
  const $rootHash = new $.BehaviorSubject<string>('');
  const $nodeVersion = new $.BehaviorSubject<NodeVersionAndBuild>({
    version: '',
    build: '',
  });

  const $isWalletActivated = new $.Subject<void>();

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

  const unsubscribe = () => updateInfo.unsubscribe();

  return {
    $managers,
    $currentLayer,
    $rootHash,
    $nodeVersion,
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
    $isSmappActivated,
  } = createMainWindow();
  // Store
  const $storeService = observeStoreService();

  // Data
  const $wallet = new $.BehaviorSubject<Wallet | null>(null);
  const $walletPath = new $.BehaviorSubject<string>('');
  const $networks = new $.BehaviorSubject<Network[]>([]);
  const $nodeConfig = new $.Subject<NodeConfig>();
  const $runNodeBeforeLogin = new $.BehaviorSubject<boolean>(
    StoreService.get(IS_AUTO_START_ENABLED)
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
    syncNodeConfig($currentNetwork, $nodeConfig, $smeshingSetupState),
    // Activate wallet and accounts
    activateWallet(
      $wallet,
      $managers,
      $isWalletActivated,
      $mainWindow,
      $nodeRestartRequest
    ),
    // When silent mode enabled, and smeshing-start: true in node-config
    makeSubscription(
      $.combineLatest($runNodeBeforeLogin, $managers, $wallet),
      ([runNode, managers, wallet]) => {
        if (!runNode) {
          return;
        }

        const type = wallet?.meta?.type;
        if (!type || isLocalNodeType(type)) {
          managers.node.startNode();
        }
      }
    ),
    // Each time when Smapp is activated (window reloaded and shown)...
    makeSubscription(
      $isSmappActivated.pipe($.withLatestFrom($managers)),
      ([_, managers]) => {
        managers.node.updateNodeStatus();
        managers.smesher.updateSmesherState();
      }
    ),
    // Update currentLayer & rootHash
    // Update networks on init
    fetchDiscovery($networks),
    // Update networks each N seconds
    fetchDiscoveryEach(60 * MINUTE, $networks),
    // And update them by users request
    listNetworksByRequest(),
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
    handleWalletIpcRequests($wallet, $walletPath, $networks, $smeshingStarted),
    // Handle Start Smeshing request
    handleSmesherIpc($managers, $smeshingStarted),
    // Handle show file
    handleShowFile($currentNetwork),
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
    observeAutoUpdates($mainWindow, $currentNetwork),
    handleOpenDashboard($mainWindow, $currentNetwork),
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
    unsubscribe: () => unsubs.forEach((unsub) => unsub()),
    subjects: {
      $networks,
    },
  };
};

export default startApp;
