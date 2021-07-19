import { ThunkDispatch } from 'redux-thunk';
import { NodeError, NodeStatus } from '../../shared/types';
import { TxList, AccountTxs } from './transactions';
import { Account, WalletMeta, Contact } from './wallet';

export interface NetworkState {
  netId: string;
  netName: string;
  genesisTime: string;
  currentLayer: number;
  rootHash: string;
  minCommitmentSize: number;
  explorerUrl: string;
}

export interface NodeState {
  status: NodeStatus | null;
  version: string;
  build: string;
  port: string;
  error: NodeError | null;
}

export interface WalletState {
  walletFiles: Array<string> | null;
  meta: WalletMeta | any;
  mnemonic: string;
  accounts: Array<Account> | [];
  currentAccountIndex: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  transactions: AccountTxs | {};
  lastUsedContacts: Array<Contact> | [];
  contacts: Array<Contact> | [];
  backupTime: string;
  vaultMode: number;
}

export interface SmesherState {
  coinbase: string;
  dataDir: string;
  commitmentSize: number;
  isSmeshing: boolean;
  isCreatingPosData: boolean;
  postProgress: any;
  postProgressError: any;
  rewards: TxList | [];
}

export interface UiState {
  isDarkMode: boolean;
  hideSmesherLeftPanel: boolean;
}

export interface RootState {
  network: NetworkState;
  node: NodeState;
  wallet: WalletState;
  smesher: SmesherState;
  ui: UiState;
}

export type CustomAction = { type: string; payload?: any };

export type AppThDispatch = ThunkDispatch<RootState, unknown, CustomAction>;

export type GetState = () => RootState;
