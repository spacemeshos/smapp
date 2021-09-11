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

export interface AccountWithBalance extends Account {
  currentState?: { balance: number; counter: number };
  projectedState?: { balance: number; counter: number };
}

export interface WalletMeta {
  displayName: string;
  created: string;
  netId: number;
  meta: {
    salt: string;
  };
  crypto: {
    cipher: string;
    cipherText: string;
  };
}

export interface Contact {
  address: string;
  nickname: string;
}
