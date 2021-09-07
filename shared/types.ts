export interface NodeVersionAndBuild {
  version: string;
  build: string;
}

//
// Rreproduction of some types from `node_types.proto`
// made by hands
//

export interface NodeStatus {
  connectedPeers: number;
  isSynced: boolean;
  syncedLayer: number;
  topLayer: number;
  verifiedLayer: number;
}

export enum NodeErrorLevel {
  LOG_LEVEL_UNSPECIFIED = 0,
  LOG_LEVEL_DEBUG = 1,
  LOG_LEVEL_INFO = 2,
  LOG_LEVEL_WARN = 3,
  LOG_LEVEL_ERROR = 4,
  LOG_LEVEL_DPANIC = 5,
  LOG_LEVEL_PANIC = 6,
  LOG_LEVEL_FATAL = 7
}

export interface NodeError {
  level: NodeErrorLevel;
  module: string;
  msg: string;
  stackTrace: string;
}

interface NetSettings {
  netId: number;
  netName: string;
  explorerUrl: string;
  dashUrl: string;
  minCommitmentSize: number;
  layerDurationSec: number;
  genesisTime: string;
}

export interface Account {
  displayName: string;
  created: number;
  currentState: { balance: number; counter: number };
  projectedState: { balance: number; counter: number };
  path: string;
  publicKey: string;
  secretKey: string;
}

export interface WalletMeta {
  displayName: string;
  created: string;
  netId: number; // 0 - test net, 1 - main net, etc
  isWalletOnly: boolean; // true if wallet configured to work with local node, false else
  meta: {
    salt: string;
  };
  crypto: {
    cipher: string;
    cipherText: {
      accounts: Array<Account>;
      mnemonic: string;
    };
  };
}

export interface Contact {
  address: string;
  nickname: string;
}

export type TypedSchemaStore = {
  netSettings?: NetSettings;
  localNode: boolean;
  accounts: Record<string, Account>;
  userSettings: {
    darkMode: boolean;
  };
  isAutoStartEnabled: boolean;
};
