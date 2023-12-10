import { Wallet, WalletFile, WalletFileWithPath } from '../shared/types';

export const isWalletDuplicate = (
  newWalletData: WalletFile,
  existingWallets: WalletFileWithPath[]
) => {
  const nameSet = new Set();
  const cipherTextSet = new Set();

  existingWallets.forEach((walletWithPath) => {
    const { wallet } = walletWithPath;
    nameSet.add(wallet.meta.displayName);
    cipherTextSet.add(wallet.crypto.cipherText);
  });

  const isDuplicateName = nameSet.has(newWalletData.meta.displayName);
  const isDuplicateCipherText = cipherTextSet.has(
    newWalletData.crypto.cipherText
  );

  return { isDuplicateName, isDuplicateCipherText };
};

export const isGenesisIDMissing = (wallet: Wallet) =>
  !wallet?.meta?.genesisID?.length;
export const isApiMissing = (wallet: Wallet) => !wallet.meta.remoteApi;
