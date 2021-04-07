import { ThunkDispatch } from 'redux-thunk';
import { Status } from './common';
import { TxList, AccountTxs } from './transactions';
import { Account, WalletMeta, Contact } from './wallet';

export interface NetworkState {
  netId: string;
  netName: string;
  genesisTime: string;
  currentLayer: number;
  rootHash: string;
  minCommitmentSize: number;
}

export interface NodeState {
  status: Status | null;
  version: string;
  build: string;
  port: string;
  error: number;
}

export interface WalletState {
  walletFiles: Array<string>;
  meta: WalletMeta | any;
  mnemonic: string;
  accounts: Array<Account> | [];
  currentAccountIndex: number;
  transactions: AccountTxs | [{ layerId: 0; data: [] }];
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
