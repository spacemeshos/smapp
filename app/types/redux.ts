import { ThunkDispatch } from 'redux-thunk';
import {
  AccountWithBalance,
  Contact,
  NodeError,
  NodeStatus,
  WalletMeta,
  PostSetupState,
  PostSetupComputeProvider,
  SmesherConfig,
  HexString,
  Tx,
  Reward,
  Network,
  NetworkState,
  SmesherReward,
  Activation,
  AccountBalance,
  Account,
  RewardsInfo,
} from '../../shared/types';
import { UpdaterState } from '../redux/updater/slice';

export { NetworkState } from '../../shared/types';

export interface NodeState {
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
  postSetupComputeProviders: PostSetupComputeProvider[];
  coinbase: string;
  dataDir: string;
  numUnits: number;
  throttle: boolean;
  provider: number | null;
  commitmentSize: number;
  numLabelsWritten: any;
  postSetupState: PostSetupState;
  postProgressError: string;
  rewards: SmesherReward[];
  rewardsInfo: RewardsInfo;
  activations: Activation[];
  config: SmesherConfig;
}

export interface UiState {
  isDarkMode: boolean;
  isClosingApp: boolean;
  hideSmesherLeftPanel: boolean;
  error: Error | null;
  skinId: string | null;
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
