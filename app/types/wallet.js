// @flow

export type Account = {
  seed: string,
  accounts: [
    {
      displayName: string,
      created: string,
      displayColor: string,
      path: string
    }
  ]
};

export type Wallet = {
  displayName: string,
  created: string,
  displayColor: string,
  netId: number, // 0 - test net, 1 - main net, etc
  crypto: {
    cipher: string,
    cipherText: string
  },
  mata: {
    salt: string
  }
};
