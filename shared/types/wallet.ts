//
// Wallet
//

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

export interface WalletCrypto {
  cipher: string;
  cipherText: string;
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

export interface Contact {
  address: string;
  nickname: string;
}
