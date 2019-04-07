// @flow
import * as bip39 from 'bip39';
import * as nacl from 'tweetnacl';

class KeyGeneratorService {
  static generateMnemonic = () => bip39.generateMnemonic();

  /**
   * Generates new master key pair using as seed 12 words mnemonic (128 bits of entropy) as per BIP39.
   * @return {{secretKey: nacl.SignKeyPair.secretKey, publicKey: nacl.SignKeyPair.publicKey}}
   */
  static generateKeyPair = ({ mnemonic }: { mnemonic: string }) => {
    // Generate 64 seed bytes (512 bits) from phrase - this is a wallet's master seed
    const seed = bip39.mnemonicToSeedHex(mnemonic);
    const seedAsUint8Array = Buffer.from(seed, 'hex');
    const left32BitsOfSeed = seedAsUint8Array.slice(0, nacl.sign.seedLength);
    const { publicKey, secretKey } = nacl.sign.keyPair.fromSeed(left32BitsOfSeed);
    return { publicKey: Buffer.from(publicKey).toString('hex'), secretKey: Buffer.from(secretKey).toString('hex') };
  };

  /**
   * @param mnemonic - string to be validated as mnemonic per BIP39 standard.
   * @return {*|boolean} true if string is a valid mnemonic, false else.
   */
  static validateMnemonic = ({ mnemonic }: { mnemonic: string }) => {
    if (!mnemonic || !mnemonic.length) {
      return false;
    }
    return bip39.validateMnemonic(mnemonic);
  };
}

export default KeyGeneratorService;
