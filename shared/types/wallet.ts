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

export interface WalletCrypto {
  cipher: string;
  cipherText: string;
}

// Encoded in WalletCrypto.cipherText
export interface WalletSecretData {
  mnemonic: string;
  accounts: Account[];
  contacts: Contact[];
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

export interface WalletFile {
  meta: WalletMeta;
  crypto: WalletCrypto;
}
