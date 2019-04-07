// @flow

export type Account = {
  displayName: string,
  created: string,
  displayColor: string,
  path: string
};

export type WalletMeta = {
  displayName: string,
  created: string,
  displayColor: string,
  netId: number, // 0 - test net, 1 - main net, etc
  meta: {
    salt: string
  },
  crypto: {
    cipher: string,
    cipherText: {
      mnemonic: string
    }
  }
};
