export type Wallet = {
  displayName: string,
  created: string, // timestamp
  displayColor: string, // rgb-value
  path: string, // example: 'm/44/[netId]/0/0/',
  crypto: {
    cipher: string, // ex: 'AES-128-CTR',
    cipherText: string, // ex: '8662bcdb82f8a38f2d4c3a1b6d848fbb19f03d02388aca9442d5e4cc7b5c70aff02c452b',
    cipherIv: string, // ex: '106c11fa110e99fdcbc5b4a29ddbff7d',
    mac: string // ex: '7c5df1ef3bde5e2642931298a9b00fe4375e8722f32e879a155e0d031dd39cf1'
  },
  kd: {
    // Key Deriviation
    n: number, // ex: 262144,
    r: number, // ex: 8,
    p: number, // ex: 1,
    saltLen: number, // ex: 16,
    dkLen: number, // ex: 32,
    salt: string // ex: '48464c24034c1e706c82336172b67156'
  }
};
