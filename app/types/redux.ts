import { ThunkDispatch } from 'redux-thunk';
import {
  Contact,
  NodeError,
  NodeStatus,
  WalletMeta,
  PostSetupState,
  PostSetupProvider,
  SmesherConfig,
  HexString,
  Tx,
  Network,
  NetworkState,
  Reward,
  Activation,
  AccountBalance,
  KeyPair,
  Account,
  NodeEvent,
  PostProvingOpts,
  NodeStartupState,
} from '../../shared/types';
import { AnyWarningObject } from '../../shared/warning';
import { UpdaterState } from '../redux/updater/slice';

export { NetworkState } from '../../shared/types';

export interface NodeState {
  startupStatus: NodeStartupState;
  status: NodeStatus | null;
  version: string;
  build: string;
  error: NodeError | null;
  port: string;
  dataPath: string;
}

export interface WalletState {
  walletFiles: Array<{ path: string; meta: WalletMeta }>;
  currentWalletPath: string | null;
  meta: WalletMeta;
  mnemonic: string;
  accounts: Array<Account>;
  keychain: Array<KeyPair>;
  currentAccountIndex: number;
  transactions: { [publicKey: HexString]: { [txId: Tx['id']]: Tx } };
  rewards: { [publicKey: HexString]: Reward[] };
  lastUsedContacts: Array<Contact>;
  contacts: Array<Contact>;
  backupTime: string;
  vaultMode: number;
  balances: Record<HexString, AccountBalance>;
}

export interface SmesherState {
  smesherId: string;
  isSmeshingStarted: boolean;
  postSetupProviders: PostSetupProvider[];
  coinbase: string;
  dataDir: string;
  freeSpace: number;
  numUnits: number;
  maxFileSize: number;
  provider: number | null;
  commitmentSize: number;
  numLabelsWritten: any;
  postSetupState: PostSetupState;
  postProvingOpts: PostProvingOpts;
  activations: Activation[];
  events: NodeEvent[];
  config: SmesherConfig;
  metadata: {
    smeshingStart: number | null;
    posInitStart: number | null;
  };
}

export interface UiState {
  isDarkMode: boolean;
  isClosingApp: boolean;
  error: Error | null;
  skinId: string | null;
  warnings: AnyWarningObject[];
  osPlatform: string;
}

export interface RootState {
  network: NetworkState;
  node: NodeState;
  wallet: WalletState;
  smesher: SmesherState;
  ui: UiState;
  updater: UpdaterState;
  networks: Network[];
}

export type CustomAction = { type: string; payload?: any };

export type AppThDispatch = ThunkDispatch<RootState, unknown, CustomAction>;

export type GetState = () => RootState;
