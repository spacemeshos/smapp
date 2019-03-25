// @flow
import { Action, Dispatch, GetState, Wallet, Account } from '/types';
import { cryptoService } from '/infra/cryptoService';
import { keyGenService } from '/infra/keyGenService';
import { fileSystemService } from '/infra/fileSystemService';
import { smColors, cryptoConsts } from '/vars';

export const DERIVE_ENCRYPTION_KEY: string = 'DERIVE_ENCRYPTION_KEY';
export const INCREMENT_WALLET_NUMBER: string = 'INCREMENT_WALLET_NUMBER';
export const INCREMENT_ACCOUNT_NUMBER: string = 'INCREMENT_ACCOUNT_NUMBER';
export const SAVE_WALLET_FILES = 'SAVE_WALLET_FILES';
export const UPDATE_WALLET_DATA: string = 'UPDATE_WALLET_DATA';
export const UPDATE_ACCOUNT_DATA: string = 'UPDATE_ACCOUNT_DATA';

export const deriveEncryptionKey = ({ passphrase }: { passphrase: string }): Action => (dispatch: Dispatch): Dispatch => {
  const salt = cryptoConsts.DEFAULT_SALT;
  const key = cryptoService.createEncryptionKey({ passphrase, salt });
  dispatch({ type: DERIVE_ENCRYPTION_KEY, payload: { key, salt } });
};

export const saveNewWallet = ({ salt = cryptoConsts.DEFAULT_SALT }: { salt: string }): Action => (dispatch: Dispatch, getState: GetState): Dispatch => {
  const walletState = getState().wallet;
  const { accountNumber, walletNumber, fileKey } = walletState;
  const unixEpochTimestamp = Math.floor(new Date() / 1000);
  const { publicKey, secretKey, seed } = keyGenService.generateKeyPair();
  const wallet = {
    displayName: `my_wallet_${walletNumber}`,
    created: unixEpochTimestamp,
    displayColor: smColors.green,
    netId: 0,
    crypto: {
      cipher: 'AES-128-CTR',
      cipherText: {
        seed,
        accounts: [
          {
            displayName: `My Account ${accountNumber}`,
            created: unixEpochTimestamp,
            displayColor: smColors.darkGreen,
            path: '0/0/1',
            balance: 100,
            pk: publicKey.toString(),
            sk: secretKey.toString()
          }
        ]
      }
    },
    meta: {
      salt
    }
  };
  const encryptedAccountsData = cryptoService.encryptData({ data: JSON.stringify(wallet.crypto.cipherText), key: fileKey });
  const fileName = `my_wallet_${walletNumber}-${unixEpochTimestamp}.json`;
  const encryptedWallet = { ...wallet, crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData } };
  try {
    fileSystemService.saveFile({
      fileName,
      fileContent: JSON.stringify(encryptedWallet),
      showDialog: false
    });
    dispatch(updateWalletData({ wallet }));
    dispatch(incrementWalletNumber());
    dispatch(incrementAccountNumber());
  } catch (err) {
    throw new Error(err);
  }
};

export const incrementWalletNumber = (): Action => ({ type: INCREMENT_WALLET_NUMBER });

export const incrementAccountNumber = (): Action => ({ type: INCREMENT_ACCOUNT_NUMBER });

export const readWalletFiles = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const files = await fileSystemService.readDirectory();
    dispatch({ type: SAVE_WALLET_FILES, payload: { files } });
  } catch (err) {
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: [] } });
    throw new Error(err);
  }
};

export const unlockWallet = ({ shouldPromtUser }: { shouldPromtUser?: boolean }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const walletState = getState().wallet;
    const { walletFiles, fileKey } = walletState;
    const fileName = shouldPromtUser ? walletFiles[0] : '';
    const file = await fileSystemService.readFile({ fileName, showDialog: !shouldPromtUser });
    const decryptedAccountsJSON = cryptoService.decryptData({ data: file.crypto.cipherText, key: fileKey });
    file.crypto.cipherText = JSON.parse(decryptedAccountsJSON);
    dispatch(updateWalletData({ wallet: file }));
  } catch (err) {
    throw new Error(err);
  }
};

export const updateWalletData = ({ wallet }: { wallet: Wallet }): Action => ({
  type: UPDATE_WALLET_DATA,
  payload: wallet
});

export const updateAccountData = ({ accountNumber, data }: { accountNumber: number, data: Account }): Action => ({
  type: UPDATE_ACCOUNT_DATA,
  payload: { accountNumber, data }
});
