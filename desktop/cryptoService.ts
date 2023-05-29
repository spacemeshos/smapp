import * as bip39 from 'bip39';
import { toHexString } from '../shared/utils';
import Bip32KeyDerivation from './main/bip32-key-derivation';

class CryptoService {
  static generateMnemonic = () => bip39.generateMnemonic();

  static createWallet = (mnemonic: string, walletIndex = 0) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const path = Bip32KeyDerivation.createWalletPath(walletIndex);
    const keyPair = Bip32KeyDerivation.derivePath(path, seed);

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
