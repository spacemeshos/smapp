// @flow
import { cryptoService } from '/infra/cryptoService';
import { keyGenService } from '/infra/keyGenService';
import { fileSystemService } from '/infra/fileSystemService';
import { smColors } from '/vars';
import cryptoConsts from '/vars/cryptoConsts';
import { Action, Dispatch, GetState } from '/types';

export const SAVE_FILE_ENCRYPTION_KEY: string = 'SAVE_FILE_ENCRYPTION_KEY';
export const INCREMENT_WALLET_NUMBER: string = 'INCREMENT_WALLET_NUMBER';
export const INCREMENT_ACCOUNT_NUMBER: string = 'INCREMENT_ACCOUNT_NUMBER';
export const SAVE_WALLET_FILES = 'SAVE_WALLET_FILES';
export const LOGOUT: string = 'LOGOUT';

export const createFileEncryptionKey = ({ passphrase }: { passphrase: string }): Action => (dispatch: Dispatch) => {
  const key = cryptoService.createEncryptionKey({ passphrase, salt: cryptoConsts.DEFAULT_SALT });
  dispatch({ type: SAVE_FILE_ENCRYPTION_KEY, payload: { key } });
};

export const saveNewWallet = ({ salt = cryptoConsts.DEFAULT_SALT }: { salt: string }): Action => (dispatch: Dispatch, getState: GetState) => {
  const authState = getState().auth;
  const { accountNumber, walletNumber, fileKey } = authState;
  const unixEpochTimestamp = Math.floor(new Date() / 1000);
  const { seed } = keyGenService.generateKeyPair();
  const walletData = {
    seed,
    accounts: [{ displayName: `My Account ${accountNumber}`, created: unixEpochTimestamp, displayColor: smColors.darkGreen, path: '0/0/1' }]
  };
  const encryptedWalletData = cryptoService.encryptData({ data: JSON.stringify(walletData), key: fileKey });
  const crypto = {
    cipher: 'AES-128-CTR',
    cipherText: encryptedWalletData
  };
  const file = {
    displayName: `my_wallet_${walletNumber}`,
    created: unixEpochTimestamp,
    displayColor: smColors.green,
    crypto,
    meta: {
      salt
    }
  };
  try {
    const fileName = `my_wallet_${walletNumber}-${unixEpochTimestamp}.json`;
    fileSystemService.saveFile({ fileName, fileContent: JSON.stringify(file), showDialog: false });
    dispatch(incrementWalletNumber());
    dispatch(incrementAccountNumber());
  } catch (err) {
    throw new Error(err);
  }
};

export const incrementWalletNumber = () => ({ type: INCREMENT_WALLET_NUMBER });

export const incrementAccountNumber = () => ({ type: INCREMENT_ACCOUNT_NUMBER });

export const readWalletFiles = (): Action => async (dispatch: Dispatch) => {
  try {
    const files = await fileSystemService.readDirectory();
    dispatch({ type: SAVE_WALLET_FILES, payload: { files } });
  } catch (err) {
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: [] } });
    throw new Error(err);
  }
};

export const reopenWallet = ({ isLoggingIn }: { isLoggingIn?: boolean }): Action => async (dispatch: Dispatch, getState: GetState) => {
  try {
    const authState = getState().auth;
    const { walletFiles, fileKey } = authState;
    const fileName = isLoggingIn ? walletFiles[0] : '';
    const file = await fileSystemService.readFile({ fileName, showDialog: !isLoggingIn });
    const decryptedWalletData = cryptoService.decryptData({ data: file.crypto.cipherText, key: fileKey });
    JSON.parse(decryptedWalletData);
  } catch (err) {
    throw new Error(err);
  }
};

export const logout = (): Action => ({ type: LOGOUT });
