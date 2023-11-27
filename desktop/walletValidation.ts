import { WalletFile, WalletWithPath } from '../shared/types';

export const hasDuplicateName = (
  newWalletData: WalletFile,
  existingWallets: WalletWithPath[]
): boolean => {
  const existingNames = new Set(
    existingWallets.map(({ wallet }) => wallet.meta.displayName)
  );
  return existingNames.has(newWalletData.meta.displayName);
};

export const hasDuplicateCipherText = (
  newWalletData: WalletFile,
  existingWallets: WalletWithPath[]
): boolean => {
  const existingCiphertexts = new Set(
    existingWallets.map(({ wallet }) => wallet.crypto.cipherText)
  );
  return existingCiphertexts.has(newWalletData.crypto.cipherText);
};
