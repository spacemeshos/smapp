// @flow
import { Action, Dispatch, GetState, WalletMeta, Account, TxList, Tx } from '/types';
import { cryptoService } from '/infra/cryptoService';
import { keyGenService } from '/infra/keyGenService';
import { fileSystemService } from '/infra/fileSystemService';
import { httpService } from '/infra/httpService';
import { smColors, cryptoConsts } from '/vars';

export const DERIVE_ENCRYPTION_KEY: string = 'DERIVE_ENCRYPTION_KEY';

export const SET_WALLET_META: string = 'SET_WALLET_META';
export const SET_ACCOUNTS: string = 'UPDATE_ACCOUNT_DATA';
export const SET_CURRENT_ACCOUNT_INDEX: string = 'SET_CURRENT_ACCOUNT_INDEX';
export const SET_MNEMONIC: string = 'SET_MNEMONIC';
export const SET_TRANSACTIONS: string = 'SET_TRANSACTIONS';

export const INCREMENT_WALLET_NUMBER: string = 'INCREMENT_WALLET_NUMBER';
export const INCREMENT_ACCOUNT_NUMBER: string = 'INCREMENT_ACCOUNT_NUMBER';

export const SAVE_WALLET_FILES = 'SAVE_WALLET_FILES';

export const GET_BALANCE: string = 'GET_BALANCE';

export const SEND_TX: string = 'SEND_TX';

export const deriveEncryptionKey = ({ passphrase }: { passphrase: string }): Action => (dispatch: Dispatch): Dispatch => {
  const salt = cryptoConsts.DEFAULT_SALT;
  const key = cryptoService.createEncryptionKey({ passphrase, salt });
  dispatch({ type: DERIVE_ENCRYPTION_KEY, payload: { key, salt } });
};

// TODO: remove stab
const transactionsStab = [
  {
    isSent: true,
    isPending: true,
    amount: 3.0002,
    address: '214w...qVt0',
    date: 'on 13 apr 2017 12:51'
  },
  {
    isSent: false,
    isPending: true,
    amount: 10.0,
    address: 'Full Node Mining Award',
    date: 'on 13 apr 2017 12:51',
    isSavedContact: true
  },
  {
    isSent: true,
    amount: 3.001,
    address: 'Mom',
    date: 'on 13 apr 2017 12:51',
    isSavedContact: true
  },
  {
    isSent: true,
    amount: 16564,
    address: 'MDMA dealer',
    date: 'on 13 apr 2017 12:51',
    isSavedContact: true
  },
  {
    isSent: false,
    isRejected: true,
    amount: 254,
    address: 'Stranger form the club',
    date: 'on 13 apr 2017 12:51',
    isSavedContact: true
  },
  {
    isSent: true,
    isRejected: true,
    amount: 54894,
    address: 'Hitman',
    date: 'on 13 apr 2017 12:51',
    isSavedContact: true
  },
  {
    isSent: true,
    isPending: true,
    amount: 3.0002,
    address: '214w...qVt0',
    date: 'on 13 apr 2017 12:51'
  },
  {
    isSent: false,
    isPending: true,
    amount: 10.0,
    address: 'Full Node Mining Award',
    date: 'on 13 apr 2017 12:51',
    isSavedContact: true
  },
  {
    isSent: true,
    amount: 3.001,
    address: 'Mom',
    date: 'on 13 apr 2017 12:51',
    isSavedContact: true
  },
  {
    isSent: true,
    amount: 16564,
    address: 'MDMA dealer',
    date: 'on 13 apr 2017 12:51',
    isSavedContact: true
  },
  {
    isSent: false,
    amount: 254,
    address: 'Stranger form the club',
    date: 'on 13 apr 2017 12:51',
    isSavedContact: true
  },
  {
    isSent: true,
    isRejected: true,
    amount: 54894,
    address: 'Hitman',
    date: 'on 13 apr 2017 12:51',
    isSavedContact: true
  }
];

export const saveNewWallet = ({ mnemonic, salt = cryptoConsts.DEFAULT_SALT }: { mnemonic?: string, salt: string }): Action => (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
  const { accountNumber, walletNumber, fileKey, walletFiles } = getState().wallet;
  const unixEpochTimestamp = Math.floor(new Date() / 1000);
  const resolvedMnemonic = mnemonic || keyGenService.generateMnemonic();
  const { publicKey, secretKey } = keyGenService.generateKeyPair({ mnemonic: resolvedMnemonic });
  const meta = {
    displayName: `my_wallet_${walletNumber}`,
    created: unixEpochTimestamp,
    displayColor: smColors.green,
    netId: 0,
    meta: {
      salt
    }
  };
  const cipherText = {
    mnemonic: resolvedMnemonic,
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
  };
  const transactions = { '0': transactionsStab }; // TODO: change to empty array after complete transaction flow is ready
  const contacts = [];
  const encryptedAccountsData = cryptoService.encryptData({ data: JSON.stringify(cipherText), key: fileKey });
  const fileName = `my_wallet_${walletNumber}-${unixEpochTimestamp}.json`;
  const fullWalletDataToFlush = { meta, crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData }, transactions, contacts };
  try {
    fileSystemService.saveFile({ fileName, fileContent: JSON.stringify(fullWalletDataToFlush), showDialog: false });
    dispatch(setWalletMeta({ meta }));
    dispatch(setAccounts({ accounts: cipherText.accounts }));
    dispatch(setMnemonic({ mnemonic: resolvedMnemonic }));
    dispatch(setCurrentAccount({ index: 0 }));
    dispatch(setTransactions({ transactions }));
    dispatch(incrementWalletNumber());
    dispatch(incrementAccountNumber());
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: walletFiles ? [fileName, ...walletFiles] : [fileName] } });
  } catch (err) {
    throw new Error(err);
  }
};

export const setWalletMeta = ({ meta }: { meta: WalletMeta }): Action => ({
  type: SET_WALLET_META,
  payload: { meta }
});

export const setAccounts = ({ accounts }: { accounts: Account[] }): Action => ({
  type: SET_ACCOUNTS,
  payload: { accounts }
});

export const setCurrentAccount = ({ index }: { index: number }): Action => ({
  type: SET_CURRENT_ACCOUNT_INDEX,
  payload: { index }
});

export const setMnemonic = ({ mnemonic }: { mnemonic: string }): Action => ({
  type: SET_MNEMONIC,
  payload: { mnemonic }
});

export const setTransactions = ({ transactions }: { transactions: TxList }): Action => ({
  type: SET_TRANSACTIONS,
  payload: { transactions }
});

export const incrementWalletNumber = (): Action => ({ type: INCREMENT_WALLET_NUMBER });

export const incrementAccountNumber = (): Action => ({ type: INCREMENT_ACCOUNT_NUMBER });

export const readWalletFiles = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const files = await fileSystemService.readDirectory();
    dispatch({ type: SAVE_WALLET_FILES, payload: { files } });
  } catch (err) {
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: null } });
    throw new Error(err);
  }
};

export const unlockWallet = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const walletState = getState().wallet;
    const { walletFiles, fileKey } = walletState;
    const file = await fileSystemService.readFile({ filePath: walletFiles[0] });
    const decryptedDataJSON = cryptoService.decryptData({ data: file.crypto.cipherText, key: fileKey });
    file.crypto.cipherText = JSON.parse(decryptedDataJSON);
    dispatch(setWalletMeta({ meta: file.meta }));
    dispatch(setAccounts({ accounts: file.crypto.cipherText.accounts }));
    dispatch(setMnemonic({ mnemonic: file.crypto.cipherText.mnemonic }));
    dispatch(setTransactions({ transactions: file.transactions }));
    dispatch(setCurrentAccount({ index: 0 }));
  } catch (err) {
    throw new Error(err);
  }
};

export const readFileName = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const fileName = await fileSystemService.getFileName();
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: [fileName] } });
  } catch (err) {
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: [] } });
    throw new Error(err);
  }
};

export const getBalance = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { accounts, currentAccountIndex } = getState().wallet;
  const balance = await httpService.getBalance({ address: accounts[currentAccountIndex].pk });
  dispatch({ type: GET_BALANCE, payload: { balance } });
};

// eslint-disable-next-line no-unused-vars
export const sendTransaction = ({ dstAddress, amount, fee, note }: { dstAddress: string, amount: number, fee: number, note: string }): Action => async (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
  try {
    const { accounts, currentAccountIndex } = getState.wallet;
    await httpService.sendTx({ srcAddress: accounts[currentAccountIndex].pk, dstAddress, amount: amount + fee });
    dispatch({ type: SEND_TX, payload: amount + fee });
    dispatch(addTransaction({ tx: { isSent: true, isPending: true, address: dstAddress, date: new Date(), amount: amount + fee } }));
  } catch (error) {
    throw new Error(error);
  }
};

export const backupWallet = () => async (dispatch: Dispatch, getState: GetState) => {
  try {
    const walletState = getState().wallet;
    const { meta, accounts, mnemonic, transactions, contacts, fileKey } = walletState;
    const copiedAccounts = [...accounts];
    const encryptedAccountsData = cryptoService.encryptData({ data: JSON.stringify({ mnemonic, accounts: copiedAccounts }), key: fileKey });
    const encryptedWallet = { meta, crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData }, transactions, contacts };
    await fileSystemService.saveFile({ fileContent: JSON.stringify(encryptedWallet), showDialog: true });
    return true;
  } catch (err) {
    throw new Error(err);
  }
};

export const addTransaction = ({ tx, accountPK }: { tx: Tx, accountPK?: string }): Action => (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { accounts, transactions, currentAccountIndex, walletFiles } = getState().wallet;
    const index = accountPK ? accounts.findIndex((account) => account.pk === accountPK) : currentAccountIndex;
    const updatedTransactions = { ...transactions, [index]: [tx, ...transactions[index]] };
    fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'transactions', data: updatedTransactions });
    dispatch(setTransactions({ transactions: updatedTransactions }));
  } catch (error) {
    throw new Error(error);
  }
};

export const addToContacts = () => ({});
