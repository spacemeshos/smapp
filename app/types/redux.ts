import { ThunkDispatch } from 'redux-thunk';
import { Status } from './common';
import { TxList, AccountTxs } from './transactions';
import { Account, WalletMeta, Contact } from './wallet';

export interface NodeState {
  status: Status | null;
  nodeIndicator: { hasError: boolean; color: string; message: string; statusText: string };
  layerDuration: number;
  stateRootHash: string;
  port: string;
  nodeIpAddress: string;
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
}

export interface SmesherState {
  coinbase: string;
  dataDir: string;
  minCommitmentSize: number;
  commitmentSize: number;
  genesisTime: number;
  networkId: number;
  isSmeshing: boolean;
  isCreatingPosData: boolean;
  postProgress: any;
  postProgressError: any;
  rewards: TxList | [];
}

export interface UiState {
  isDarkMode: boolean;
}

export interface RootState {
  node: NodeState;
  wallet: WalletState;
  smesher: SmesherState;
  ui: UiState;
}

export type CustomAction = { type: string; payload?: any };

export type AppThDispatch = ThunkDispatch<RootState, unknown, CustomAction>;

export type GetState = () => RootState;
