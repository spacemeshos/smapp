export interface Account {
  displayName: string;
  created: string;
  path: string;
  publicKey: string;
  secretKey: string;
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
  netId: number;
  remoteApi: string;
  meta: {
    salt: string;
  };
}

export interface WalletSecrets {
  mnemonic: string;
  accounts: Account[];
  contacts: Contact[];
}

export interface WalletSecretsEncrypted {
  cipher: string;
  cipherText: string;
}

export interface Wallet {
  meta: WalletMeta;
  crypto: WalletSecrets;
}

// Encrypted Wallet representation on the filesystem
export interface WalletFile {
  meta: WalletMeta;
  crypto: WalletSecretsEncrypted;
}
