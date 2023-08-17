import { MnemonicExisting, MnemonicNew } from './types';

export const isMnemonicExisting = (
  mnemonic: any
): mnemonic is MnemonicExisting =>
  mnemonic && typeof mnemonic.existing === 'string';
export const isMnemonicNew = (mnemonic: any): mnemonic is MnemonicNew =>
  mnemonic && (mnemonic.strength === 12 || mnemonic.strength === 24);
