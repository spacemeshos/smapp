import { HexString } from './networkMisc';

export interface KeyPair {
  displayName: string;
  created: string;
  path: string;
  publicKey: string;
  secretKey: string;
}

export interface Account {
  displayName: string;
  created: string;
  address: string;
  spawnArgs?: any;
}

export interface AccountBalance {
  currentState?: { balance: number; counter: number };
  projectedState?: { balance: number; counter: number };
}

export type AccountWithBalance = Account & AccountBalance;

export interface Contact {
  address: string;
  nickname: string;
}

export enum WalletType {
  LocalNode = 'local-node',
  RemoteApi = 'remote-api',
}

export interface WalletMeta {
  displayName: string;
  created: string;
  type: WalletType;
  genesisID: string;
  remoteApi: string;
  meta: {
    salt: string;
  };
}

export interface WalletSecrets {
  mnemonic: string;
  accounts: KeyPair[];
  contacts: Contact[];
}

export interface WalletSecretsEncryptedLegacy {
  cipher: 'AES-128-CTR';
  cipherText: string;
}

export interface WalletSecretsEncryptedGCM {
  cipher: 'AES-GCM';
  cipherParams: {
    iv: HexString;
  };
  kdf: 'PBKDF2';
  kdfparams: {
    dklen: number;
    hash: 'SHA-512';
    iterations: number;
    salt: HexString;
  };
  cipherText: string;
}

export type WalletSecretsEncrypted =
  | WalletSecretsEncryptedLegacy
  | WalletSecretsEncryptedGCM;

export interface Wallet {
  meta: WalletMeta;
  crypto: WalletSecrets;
}

// Encrypted Wallet representation on the filesystem
export interface WalletFile {
  meta: WalletMeta;
  crypto: WalletSecretsEncrypted;
}
