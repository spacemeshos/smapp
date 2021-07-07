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
