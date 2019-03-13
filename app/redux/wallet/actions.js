// @flow
import { cryptoService } from '/infra/cryptoService';
import cryptoConsts from '/vars/cryptoConsts';
import { walletStorageService } from '/infra/storageServices';
import { keyGenService } from '/infra/keyGenService';
import { fileSystemService } from '/infra/fileSystemService';
import { smColors } from '/vars';
import { Action, Dispatch, GetState } from '/types';

export const SAVE_FILE_ENCRYPTION_KEY: string = 'SAVE_FILE_ENCRYPTION_KEY';
export const INCREMENT_WALLET_NUMBER: string = 'INCREMENT_WALLET_NUMBER';
export const INCREMENT_ACCOUNT_NUMBER: string = 'INCREMENT_ACCOUNT_NUMBER';
export const LOGOUT: string = 'LOGOUT';

export const createFileEncryptionKey = ({ pinCode }: { pinCode: string }): Action => (dispatch: Dispatch) => {
  const key = cryptoService.createEncryptionKey({ pinCode, salt: cryptoConsts.DEFAULT_SALT });
  dispatch({ type: SAVE_FILE_ENCRYPTION_KEY, payload: { key } });
  dispatch(saveNewWallet({ key, salt: cryptoConsts.DEFAULT_SALT }));
  walletStorageService.saveFileKey({ key });
};

export const saveNewWallet = ({ key, salt }: { key: Buffer, salt: string }): Action => (dispatch: Dispatch, getState: GetState) => {
  const walletState = getState().wallet;
  const unixEpochTimestamp = Math.floor(new Date() / 1000);
  const { seed } = keyGenService.generateKeyPair();
  const walletData = {
    seed,
    accounts: [{ displayName: `My Account ${walletState.accountNumber}`, created: unixEpochTimestamp, displayColor: smColors.darkGreen, path: '0/0/1' }]
  };
  const encryptedWalletData = cryptoService.encryptData({ data: JSON.stringify(walletData), key });
  const crypto = {
    cipher: 'AES-128-CTR',
    cipherText: encryptedWalletData
  };
  const file = {
    displayName: `my_wallet_${walletState.walletNumber}`,
    created: unixEpochTimestamp,
    displayColor: smColors.green,
    crypto,
    meta: {
      salt
    }
  };
  try {
    const fileName = `my_wallet_${walletState.walletNumber}-${unixEpochTimestamp}.json`;
    fileSystemService.saveFile({ fileName, fileContent: JSON.stringify(file), showDialog: false });
    dispatch(incrementWalletNumber());
    dispatch(incrementAccountNumber());
    walletStorageService.addWalletFilePath({ fileName });
  } catch (err) {
    throw new Error(err);
  }
};

export const incrementWalletNumber = () => ({ type: INCREMENT_WALLET_NUMBER });

export const incrementAccountNumber = () => ({ type: INCREMENT_ACCOUNT_NUMBER });

export const logout = (): Action => ({
  type: LOGOUT
});
