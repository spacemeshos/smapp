import * as bip39 from 'bip39';
import * as nacl from 'tweetnacl';

class KeyGeneratorService {
  /**
   * Generates a 12 words mnemonic (128 bits of entropy) according to BIP39 standard.
   * @return {string} generated string.
   */
  static generateMnemonicPhrase = () => bip39.generateMnemonic();

  /**
   * Function
   * @param mnemonicPhrase - string used as seed for deriving pair { private key, public key }
   */
  static generateKeyPair = () => {
    // Generate 64 seed bytes (512 bits) from phrase - this is a wallet's master seed
    // const seed = bip39.mnemonicToSeedHex(mnemonicPhrase); // TODO: take first 32 bytes and convert to byte array
    const sk = new Uint8Array(nacl.box.secretKeyLength);
    nacl.box.keyPair.fromSecretKey(sk);
  };

  /**
   * Function
   * @param mnemonicString - string to be validated as mnemonic per BIP39 standard.
   * @return {*|boolean} true if string is a valid mnemonic, false else.
   */
  static validateMnemonic = ({ mnemonicString }) => {
    if (!mnemonicString || !mnemonicString.length) {
      return false;
    }
    return bip39.validateMnemonic(mnemonicString);
  };
}

export default KeyGeneratorService;
