import { WalletFile, WalletFileWithPath } from '../../shared/types';
import {
  isApiMissing,
  isGenesisIDMissing,
  isWalletDuplicate,
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
] as WalletFileWithPath[];

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
  describe('isWalletDuplicate', () => {
    test('should return true for duplicate names', () => {
      const { isDuplicateName } = isWalletDuplicate(
        duplicateNameWallet,
        walletFiles
      );
      expect(isDuplicateName).toBeTruthy();
    });

    test('should return false for unique names', () => {
      const { isDuplicateName } = isWalletDuplicate(newWallet, walletFiles);
      expect(isDuplicateName).toBeFalsy();
    });

    test('should return true for duplicate cipher texts', () => {
      const { isDuplicateCipherText } = isWalletDuplicate(
        duplicateCipherTextWallet,
        walletFiles
      );
      expect(isDuplicateCipherText).toBeTruthy();
    });

    test('should return false for unique cipher texts', () => {
      const { isDuplicateCipherText } = isWalletDuplicate(
        newWallet,
        walletFiles
      );
      expect(isDuplicateCipherText).toBeFalsy();
    });
  });

  describe('isGenesisIDMissing', () => {
    it('should return false when genesisID is present', () => {
      const walletWithGenesisID = {
        meta: {
          displayName: 'Wallet',
          created: '2023-01-01',
          genesisID: 'some-genesis-id',
          remoteApi: 'http://localhost:1234',
          type: 'type1',
        },
      };
      expect(isGenesisIDMissing(walletWithGenesisID as any)).toBe(false);
    });

    it('should return true when genesisID is missing', () => {
      const walletWithoutGenesisID = {
        meta: {
          displayName: 'Wallet',
          created: '2023-01-01',
          genesisID: '',
          remoteApi: 'http://localhost:1234',
          type: 'type1',
        },
      };
      expect(isGenesisIDMissing(walletWithoutGenesisID as any)).toBe(true);
    });
  });

  describe('isApiMissing', () => {
    it('should return false when remoteApi is present', () => {
      const walletWithApi = {
        meta: {
          displayName: 'Wallet',
          created: '2023-01-01',
          genesisID: 'some-genesis-id',
          remoteApi: 'http://localhost:1234',
          type: 'type1',
        },
      };
      expect(isApiMissing(walletWithApi as any)).toBe(false);
    });

    it('should return true when remoteApi is missing', () => {
      const walletWithoutApi = {
        meta: {
          displayName: 'Wallet',
          created: '2023-01-01',
          genesisID: 'some-genesis-id',
          remoteApi: '',
          type: 'type1',
        },
      };
      expect(isApiMissing(walletWithoutApi as any)).toBe(true);
    });
  });
});
