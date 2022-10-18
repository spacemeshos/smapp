import encryptionConst from '../encryptionConst';

const SALT = new TextEncoder().encode(encryptionConst.DEFAULT_SALT);

export default class Bip32KeyDerivation {
  static COIN_TYPE = 540;

  static BIP_PROPOSAL = 44;

  static BIP32HardenedKeyStart = 0x80000000;

  static BIP44Purpose = 0x8000002c;

  static BIP44SpaceMeshCoinType = 0x8000021c;

  static getBIP44Account(account: number) {
    // eslint-disable-next-line no-bitwise
    return (Bip32KeyDerivation.BIP32HardenedKeyStart | account) >>> 0;
  }

  static createWalletPath(index: number) {
    return `${Bip32KeyDerivation.BIP_PROPOSAL}'/${Bip32KeyDerivation.COIN_TYPE}'/0'/0'/${index}'`;
  }

  static derivePath = (
    path: string,
    seed: Uint8Array
  ): { secretKey: Uint8Array; publicKey: Uint8Array } => {
    const segments = path
      .split('/')
      .map((v) => v.replaceAll("'", ''))
      .map((el) => parseInt(el, 10))
      .map((segment, index) => {
        if (index === 0 && segment === Bip32KeyDerivation.BIP_PROPOSAL) {
          return Bip32KeyDerivation.BIP44Purpose;
        }

        if (index === 1 && segment === Bip32KeyDerivation.COIN_TYPE) {
          return Bip32KeyDerivation.BIP44SpaceMeshCoinType;
        }

        return Bip32KeyDerivation.getBIP44Account(segment);
      });

    const lastKeyPair = segments.reduce(
      (prev, curr) => {
        const keyPair = Bip32KeyDerivation.newChildKeyPair(curr, prev.seed);

        return {
          seed: keyPair.secretKey.slice(0, 32),
          secretKey: keyPair.secretKey,
          publicKey: keyPair.publicKey,
        };
      },
      {
        seed,
        secretKey: new Uint8Array(32),
        publicKey: new Uint8Array(64),
      }
    );
    return {
      publicKey: lastKeyPair.publicKey,
      secretKey: lastKeyPair.secretKey,
    };
  };

  private static newChildKeyPair(index: number, seed: Uint8Array) {
    let publicKey = new Uint8Array(32);
    let secretKey = new Uint8Array(64);

    const saveKeys = (pk: Uint8Array, sk: Uint8Array) => {
      if (pk === null || sk === null) {
        throw new Error('key generation failed');
      }
      publicKey = pk;
      secretKey = sk;
    };

    // @ts-ignore
    global.__deriveNewKeyPair(seed, index, SALT, saveKeys);

    return {
      publicKey,
      secretKey,
    };
  }
}
