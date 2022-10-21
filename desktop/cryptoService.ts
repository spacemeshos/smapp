import * as bip39 from 'bip39';
import { fromHexString, toHexString } from '../shared/utils';
import Bip32KeyDerivation from './main/bip32-key-derivation';

class CryptoService {
  static generateMnemonic = () => bip39.generateMnemonic();

  /**
   * Generates new master key pair using as seed 12 words mnemonic (128 bits of entropy) as per BIP39.
   * Inside call to function "__generateKeyPair" is made - it's exposed from compiled WASM and generates keys following ed25519 protocol
   * @return {{secretKey: Uint8Array[64], publicKey: Uint8Array[32]}}
   */
  static generateKeyPair = (seed: Buffer) => {
    // Generate 64 seed bytes (512 bits) from phrase - this is a wallet's master seed
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
    global.__generateKeyPair(seed, saveKeys); // eslint-disable-line no-undef
    return {
      publicKey,
      secretKey,
    };
  };

  static createWallet = (mnemonic: string, walletIndex = 0) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const path = Bip32KeyDerivation.createWalletPath(walletIndex);
    const masterKeyPair = CryptoService.generateKeyPair(seed.slice(32));
    const masterSeed = masterKeyPair.secretKey.slice(0, 32);
    const keyPair = Bip32KeyDerivation.derivePath(path, masterSeed);

    return {
      mnemonic,
      walletPath: path,
      publicKey: toHexString(keyPair.publicKey),
      secretKey: toHexString(keyPair.secretKey),
      address: toHexString(keyPair.publicKey),
    };
  };

  /**
   * @return {{secretKey: Uint8Array[64], publicKey: Uint8Array[32]}}
   */
  static deriveNewKeyPair = ({
    mnemonic,
    index,
  }: {
    mnemonic: string;
    index: number;
  }) => {
    return CryptoService.createWallet(mnemonic, index);
  };

  /**
   * Signs message to be sent to node.
   * @param secretKey - string
   * @param message - utf8 string representation of message
   * @return {Promise} when resolved returns signature as Uint8Array(64)
   */
  static signMessage = ({
    message,
    secretKey,
  }: {
    message: string;
    secretKey: string;
  }): Promise<string> => {
    const sk = fromHexString(secretKey);
    return new Promise((resolve) => {
      const messageAsUint8Array = new TextEncoder().encode(message);
      // @ts-ignore
      global.__signTransaction(sk, messageAsUint8Array, (sig) => {
        resolve(toHexString(sig));
      });
    });
  };

  /**
   * @param mnemonic - string to be validated as mnemonic per BIP39 standard.
   * @return {*|boolean} true if string is a valid mnemonic, false else.
   */
  validateMnemonic = ({ mnemonic }: { mnemonic: string }) => {
    if (!mnemonic || !mnemonic.length) {
      return false;
    }
    return bip39.validateMnemonic(mnemonic);
  };
}

export default CryptoService;
