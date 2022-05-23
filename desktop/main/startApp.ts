import * as $ from 'rxjs';
import {
  Network,
  NodeConfig,
  NodeVersionAndBuild,
  Wallet,
} from '../../shared/types';
import { MINUTE } from './constants';
import createMainWindow from './createMainWindow';
import observeStoreService from './sources/storeService';
import {
  fetchDiscovery,
  fetchDiscoveryEach,
  updateDiscoveryByRequest,
} from './sources/fetchDiscovery';
import spawnManagers$ from './reactions/spawnManagers';
import switchNetwork from './reactions/switchNetwork';
import activateWallet from './reactions/activateWallet';
import ensureNetwork from './reactions/ensureNetwork';
import handleCloseApp from './reactions/handleCloseApp';
import handleWalletIpcRequests from './sources/wallet.ipc';
import syncToRenderer from './reactions/syncToRenderer';
import currentNetwork from './sources/currentNetwork';
import { AppStore, Managers } from './app.types';

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
        ).pipe($.retry(5), $.delay(1000))
      )
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
  } = createMainWindow();
  // Store
  const $storeService = observeStoreService();

  // Data
  const $wallet = new $.BehaviorSubject<Wallet | null>(null);
  const $walletPath = new $.BehaviorSubject<string>('');
  const $networks = new $.BehaviorSubject<Network[]>([]);
  const $currentNetwork = currentNetwork($wallet, $networks);
  const $nodeConfig = new $.Subject<NodeConfig>();
  const {
    $managers,
    $currentLayer,
    $rootHash,
    $nodeVersion,
    $isWalletActivated,
  } = loadNetworkData();

  // Reactions
  // List of unsubscribe functions
  const unsubs = [
    // Spawn managers (and handle unsubscribing)
    spawnManagers$($nodeConfig, $managers, $mainWindow),
    // On changing network -> update node config
    switchNetwork($currentNetwork, $nodeConfig, $mainWindow),
    // Activate wallet and accounts
    activateWallet($wallet, $managers, $isWalletActivated),
    // Update currentLayer & rootHash
    // Update networks on init
    fetchDiscovery($networks),
    // Update networks each N seconds
    fetchDiscoveryEach(60 * MINUTE, $networks),
    // And update them by users request
    updateDiscoveryByRequest($networks),
    // If current network does not exist in discovery service
    // then ask User to switch the network
    ensureNetwork($wallet, $networks, $currentNetwork, $mainWindow),
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
    handleWalletIpcRequests($wallet, $walletPath, $networks),
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
      $nodeVersion
    ),
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
