export interface Account {
  displayName: string;
  created: number;
  balance: string;
  path: string;
  publicKey: string;
  secretKey: string;
}

export interface WalletMeta {
  displayName: string;
  created: string;
  netId: number; // 0 - test net, 1 - main net, etc
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
