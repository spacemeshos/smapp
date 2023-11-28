import { WalletFile, WalletWithPath } from '../../shared/types';
import {
  hasDuplicateCipherText,
  hasDuplicateName,
} from '../../desktop/walletValidation';

const walletFiles = [
  {
    path: 'path/to/wallet1',
    wallet: {
      meta: { displayName: 'Wallet One' },
      crypto: { cipherText: 'cipher1' },
    },
  },
  {
    path: 'path/to/wallet2',
    wallet: {
      meta: { displayName: 'Wallet Two' },
      crypto: { cipherText: 'cipher2' },
    },
  },
] as WalletWithPath[];

const newWallet = {
  meta: { displayName: 'New Wallet' },
  crypto: { cipherText: 'cipher3' },
} as WalletFile;

const duplicateNameWallet = {
  meta: { displayName: 'Wallet One' },
  crypto: { cipherText: 'cipher3' },
} as WalletFile;

const duplicateCipherTextWallet = {
  meta: { displayName: 'Wallet Three' },
  crypto: { cipherText: 'cipher1' },
} as WalletFile;

describe('Wallet Validation', () => {
  describe('hasDuplicateName', () => {
    test('should return true for duplicate names', () => {
      const result = hasDuplicateName(duplicateNameWallet, walletFiles);
      expect(result).toBeTruthy();
    });

    test('should return false for unique names', () => {
      const result = hasDuplicateName(newWallet, walletFiles);
      expect(result).toBeFalsy();
    });
  });

  describe('hasDuplicateCipherText', () => {
    test('should return true for duplicate cipher texts', () => {
      const result = hasDuplicateCipherText(
        duplicateCipherTextWallet,
        walletFiles
      );
      expect(result).toBeTruthy();
    });

    test('should return false for unique cipher texts', () => {
      const result = hasDuplicateCipherText(newWallet, walletFiles);
      expect(result).toBeFalsy();
    });
  });
});
