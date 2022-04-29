export const LAST_SELECTED_WALLET_PATH_KEY = 'lastSelectedWalletPath';

export const setLastSelectedWalletPath = (walletPath: string) =>
  window.localStorage.setItem(LAST_SELECTED_WALLET_PATH_KEY, walletPath);

export const getLastSelectedWalletPath = () =>
  window.localStorage.getItem(LAST_SELECTED_WALLET_PATH_KEY);

export const getIndexOfLastSelectedWalletPath = (
  walletFiles: { path: string }[]
) => {
  if (!(walletFiles instanceof Array)) return 0;

  const last = getLastSelectedWalletPath();
  const idx = walletFiles.findIndex(({ path }) => path === last);
  return idx > -1 ? idx : 0;
};
