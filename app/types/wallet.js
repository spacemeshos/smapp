// @flow

export type Account = {
  displayName: string,
  created: number,
  path: string,
  balance: number,
  pk: string,
  sk: string,
  layerId: number
};

export type WalletMeta = {
  displayName: string,
  created: string,
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

export type Contact = {
  address: string,
  nickname: string
};
