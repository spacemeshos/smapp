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
} from '../../shared/types';
import { UpdaterState } from '../redux/updater/slice';

export interface NetworkState {
  netId: string;
  netName: string;
  genesisTime: string;
  currentLayer: number;
  layerDurationSec: number;
  rootHash: string;
  explorerUrl: string;
}

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
  accounts: Array<AccountWithBalance>;
  currentAccountIndex: number;
  transactions: { [publicKey: HexString]: { [txId: Tx['id']]: Tx } };
  rewards: { [publicKey: HexString]: Reward[] };
  lastUsedContacts: Array<Contact>;
  contacts: Array<Contact>;
  backupTime: string;
  vaultMode: number;
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
  rewards: Reward[] | [];
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
