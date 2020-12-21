import { ThunkDispatch } from 'redux-thunk';
import { Status } from './common';
import { TxList, AccountTxs } from './transactions';
import { Account, WalletMeta, Contact } from './wallet';

export interface NodeState {
  status: Status | null;
  nodeIndicator: { hasError: boolean; color: string; message: string; statusText: string };
  miningStatus: number;
  rewardsAddress: string;
  genesisTime: number;
  networkId: number;
  commitmentSize: number;
  layerDuration: number;
  stateRootHash: string;
  port: string;
  rewards: TxList | [];
  nodeIpAddress: string;
  posDataPath: string;
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

export interface UiState {
  isDarkMode: boolean;
  hideSmesherLeftPanel: boolean;
}

export interface RootState {
  node: NodeState;
  wallet: WalletState;
  ui: UiState;
}

export type CustomAction = { type: string; payload?: any };

export type AppThDispatch = ThunkDispatch<RootState, unknown, CustomAction>;

export type GetState = () => RootState;
