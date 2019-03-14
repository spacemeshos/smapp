// @flow
import * as bip39 from 'bip39';
import * as nacl from 'tweetnacl';

class KeyGeneratorService {
  /**
   * Generates new master key pair using as seed 12 words mnemonic (128 bits of entropy) as per BIP39.
   * @return {{secretKey: nacl.SignKeyPair.secretKey, publicKey: nacl.SignKeyPair.publicKey, seed: string}}
   */
  static generateKeyPair = () => {
    const mnemonic = bip39.generateMnemonic();
    // Generate 64 seed bytes (512 bits) from phrase - this is a wallet's master seed
    const seed = bip39.mnemonicToSeedHex(mnemonic);
    const seedAsUint8Array = Buffer.from(seed, 'hex');
    const left32BitsOfSeed = seedAsUint8Array.slice(0, nacl.sign.seedLength);
    const { publicKey, secretKey } = nacl.sign.keyPair.fromSeed(left32BitsOfSeed);
    return { publicKey, secretKey, seed };
  };

  /**
   * Derives master key pair from provided seed.
   * @param seed - hex string.
   * @return {{secretKey: nacl.SignKeyPair.secretKey, publicKey: nacl.SignKeyPair.publicKey}}
   */
  static generateKeyPairFromSeed = ({ seed }: { seed: string }) => {
    const seedAsUint8Array = Buffer.from(seed, 'hex');
    const left32BitsOfSeed = seedAsUint8Array.slice(0, nacl.sign.seedLength);
    const { publicKey, secretKey } = nacl.sign.keyPair.fromSeed(left32BitsOfSeed);
    return { publicKey, secretKey };
  };

  /**
   * Function
   * @param mnemonicString - string to be validated as mnemonic per BIP39 standard.
   * @return {*|boolean} true if string is a valid mnemonic, false else.
   */
  static validateMnemonic = (mnemonicString: string) => {
    if (!mnemonicString || !mnemonicString.length) {
      return false;
    }
    return bip39.validateMnemonic(mnemonicString);
  };
}

export default KeyGeneratorService;
