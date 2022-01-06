import { Tx } from './tx';

export interface Account {
  displayName: string;
  created: string;
  path: string;
  publicKey: string;
  secretKey: string;
  txs?: Tx[];
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

export interface WalletMeta {
  displayName: string;
  created: string;
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
