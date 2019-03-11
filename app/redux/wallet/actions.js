// @flow
import { cryptoService } from '/infra/cryptoService';
import cryptoConsts from '/vars/cryptoConsts';
import { walletStorageService } from '/infra/storageServices';

export const SAVE_FILE_ENCRYPTION_KEY: string = 'SAVE_FILE_ENCRYPTION_KEY';
// export const SAVE_NEW_WALLET: string = 'SAVE_NEW_WALLET';
export const SET_LOGOUT: string = 'SET_LOGOUT';

export const createFileEncryptionKey = ({ pinCode }: { pinCode: string }) => (dispatch: Function) => {
  const key = cryptoService.createEncryptionKey({ pinCode, salt: cryptoConsts.DEFAULT_SALT });
  dispatch({ type: SAVE_FILE_ENCRYPTION_KEY, payload: { key } });
  walletStorageService.saveWalletFileKey(key);
};

// export const saveNewWallet = ({ key, salt }: { key: string, salt: string }) => (dispatch: Function) => {
//   const walletData = {
//
//   };
//   // TODO: generate new master key pair
//   // TODO: save file data before encryption to local storage
//   // TODO: encrypt wallet data before writing to file
//   const file = {
//     name: 'aaa',
//     createdAt: Date.now().toLocaleString(),
//     data: walletData
//   };
//   walletStorageService.saveWalletData(walletData);
//   dispatch({ type: SAVE_NEW_WALLET, payload: {} });
// };

export function setLogout() {
  return {
    type: SET_LOGOUT,
    payload: null
  };
}
