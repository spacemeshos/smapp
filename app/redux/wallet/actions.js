// @flow
import { Action, Dispatch, GetState, WalletMeta, Account, TxList, Tx, Contact } from '/types';
import { fileEncryptionService } from '/infra/fileEncryptionService';
import { cryptoService } from '/infra/cryptoService';
import { fileSystemService } from '/infra/fileSystemService';
import { localStorageService } from '/infra/storageServices';
import { httpService } from '/infra/httpService';
import { smColors, cryptoConsts } from '/vars';

export const DERIVE_ENCRYPTION_KEY: string = 'DERIVE_ENCRYPTION_KEY';

export const SET_WALLET_META: string = 'SET_WALLET_META';
export const SET_ACCOUNTS: string = 'SET_ACCOUNTS';
export const SET_CURRENT_ACCOUNT_INDEX: string = 'SET_CURRENT_ACCOUNT_INDEX';
export const SET_MNEMONIC: string = 'SET_MNEMONIC';
export const SET_TRANSACTIONS: string = 'SET_TRANSACTIONS';
export const SET_CONTACTS: string = 'SET_CONTACTS';
export const ADD_LAST_USED_ADDRESS: string = 'ADD_LAST_USED_ADDRESS';

export const INCREMENT_WALLET_NUMBER: string = 'INCREMENT_WALLET_NUMBER';
export const INCREMENT_ACCOUNT_NUMBER: string = 'INCREMENT_ACCOUNT_NUMBER';

export const SAVE_WALLET_FILES = 'SAVE_WALLET_FILES';
export const DELETE_WALLET_FILE = 'DELETE_WALLET_FILE';

export const GET_BALANCE: string = 'GET_BALANCE';
export const GET_CONTACTS: string = 'GET_CONTACTS';

export const SEND_TX: string = 'SEND_TX';

export const deriveEncryptionKey = ({ passphrase }: { passphrase: string }): Action => {
  const salt = cryptoConsts.DEFAULT_SALT;
  const key = fileEncryptionService.createEncryptionKey({ passphrase, salt });
  return { type: DERIVE_ENCRYPTION_KEY, payload: { key } };
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

// TODO: remove test stub
const contactsListStub = [
  {
    nickname: 'Frank Sinatra',
    address: '11mxxzzkkdhhnwkkvjhhvgspacemeshflkjlkvkjkfnnn2nifjfj94kjbnkjrgkj'
  },
  {
    nickname: 'Nat King Cole',
    address: 'spacemesh1spacemesh1spacemesh1spacemesh1spacemesh1spacemesh1spac'
  },
  {
    nickname: 'Etta James',
    address: 'spacemesh1spacemesh2spacemesh2spacemesh2spacemesh2spacemesh1spac'
  },
  {
    nickname: 'Mikael Barishnikov',
    address: 'spacemesh3spacemesh3spacemesh3spacemesh3spacemesh3spacemesh1spac'
  },
  {
    nickname: 'Miles Davis',
    address: 'spacemesh4spacemesh4spacemesh4spacemesh4spacemesh4spacemesh4spac',
    email: 'miles@milesdavis.com'
  },
  {
    nickname: 'Amy Winehouse',
    address: 'spacemesh5spacemesh5spacemesh5spacemesh5spacemesh5spacemesh5spac'
  }
];

export const saveNewWallet = ({ mnemonic, salt = cryptoConsts.DEFAULT_SALT }: { mnemonic?: string, salt: string }): Action => async (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
  const { accountNumber, walletNumber, fileKey, walletFiles } = getState().wallet;
  const unixEpochTimestamp = Math.floor(new Date() / 1000);
  const resolvedMnemonic = mnemonic || cryptoService.generateMnemonic();
  const { publicKey, secretKey } = await cryptoService.generateKeyPair({ mnemonic: resolvedMnemonic });
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
        pk: publicKey,
        sk: secretKey
      }
    ]
  };
  const transactions = { '0': transactionsStab }; // TODO: change to empty array after complete transaction flow is ready
  const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify(cipherText), key: fileKey });
  const fileName = `my_wallet_${walletNumber}-${unixEpochTimestamp}.json`;
  const fullWalletDataToFlush = { meta, crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData }, transactions, contacts: contactsListStub };
  try {
    fileSystemService.saveFile({ fileName, fileContent: JSON.stringify(fullWalletDataToFlush), showDialog: false });
    dispatch(setWalletMeta({ meta }));
    dispatch(setAccounts({ accounts: cipherText.accounts }));
    dispatch(setMnemonic({ mnemonic: resolvedMnemonic }));
    dispatch(setCurrentAccount({ index: 0 }));
    dispatch(setTransactions({ transactions }));
    dispatch(setContacts({ contacts: contactsListStub }));
    dispatch(incrementWalletNumber());
    dispatch(incrementAccountNumber());
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: walletFiles ? [fileName, ...walletFiles] : [fileName] } });
  } catch (err) {
    throw new Error(err);
  }
};

export const setWalletMeta = ({ meta }: { meta: WalletMeta }): Action => ({ type: SET_WALLET_META, payload: { meta } });

export const setAccounts = ({ accounts }: { accounts: Account[] }): Action => ({ type: SET_ACCOUNTS, payload: { accounts } });

export const setCurrentAccount = ({ index }: { index: number }): Action => ({ type: SET_CURRENT_ACCOUNT_INDEX, payload: { index } });

export const setMnemonic = ({ mnemonic }: { mnemonic: string }): Action => ({ type: SET_MNEMONIC, payload: { mnemonic } });

export const setTransactions = ({ transactions }: { transactions: TxList }): Action => ({ type: SET_TRANSACTIONS, payload: { transactions } });

export const setContacts = ({ contacts }: { contacts: Contact[] }): Action => ({ type: SET_CONTACTS, payload: { contacts } });

export const addLastUsedAddress = ({ contact }: { contact: Contact }): Action => ({ type: ADD_LAST_USED_ADDRESS, payload: { contact } });

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
    const decryptedDataJSON = fileEncryptionService.decryptData({ data: file.crypto.cipherText, key: fileKey });
    file.crypto.cipherText = JSON.parse(decryptedDataJSON);
    dispatch(setWalletMeta({ meta: file.meta }));
    dispatch(setAccounts({ accounts: file.crypto.cipherText.accounts }));
    dispatch(setMnemonic({ mnemonic: file.crypto.cipherText.mnemonic }));
    dispatch(setTransactions({ transactions: file.transactions }));
    dispatch(setContacts({ contacts: file.contacts }));
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

export const sendTransaction = ({ dstAddress, amount, fee, note }: { dstAddress: string, amount: number, fee: number, note: string }): Action => async (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
  try {
    const { accounts, currentAccountIndex } = getState().wallet;
    const signature = await cryptoService.signTransaction({
      message: JSON.stringify({ dstAddress, amount: amount + fee, note }),
      secretKey: accounts[currentAccountIndex].sk
    });
    await httpService.sendTx({ srcAddress: accounts[currentAccountIndex].pk, dstAddress, amount: amount + fee, note, signature });
    dispatch({ type: SEND_TX, payload: amount + fee });
    dispatch(addTransaction({ tx: { isSent: true, isPending: true, address: dstAddress, date: new Date(), amount: amount + fee } }));
  } catch (error) {
    throw new Error(error);
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

export const addToContacts = ({ contact }: Contact): Action => (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { contacts, walletFiles } = getState().wallet;
    const updatedContacts = [contact, ...contacts];
    fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'contacts', data: updatedContacts });
    dispatch(setContacts({ contacts: updatedContacts }));
  } catch (error) {
    throw new Error(error);
  }
};

export const updateWalletMeta = ({ metaFieldName, data }: { metaFieldName: string, data: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { meta, walletFiles } = getState().wallet;
    const updatedMeta = { ...meta, [metaFieldName]: data };
    fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'meta', data: updatedMeta });
    dispatch(setWalletMeta({ meta: updatedMeta }));
  } catch (error) {
    throw new Error(error);
  }
};

export const updateAccount = ({ accountIndex, fieldName, data }: { accountIndex: number, fieldName: string, data: any }): Action => async (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
  const { accounts } = getState().wallet;
  const updatedAccount = { ...accounts[accountIndex], [fieldName]: data };
  const updatedAccounts = [...accounts.slice(0, accountIndex), updatedAccount, ...accounts.slice(accountIndex + 1)];
  await dispatch(updateAccountsInFile({ accounts: updatedAccounts }));
  dispatch(setAccounts({ accounts: updatedAccounts }));
};

export const updateAccountsInFile = ({ accounts }: { accounts?: Account[] }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { fileKey, mnemonic, walletFiles } = getState().wallet;
  const cipherText = { mnemonic, accounts };
  const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify(cipherText), key: fileKey });
  await fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'crypto', data: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData } });
};

// TODO: This is a test function
export const deleteWalletFile = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { walletFiles } = getState().wallet;
    const options = {
      title: 'Delete File',
      message: 'All wallet data will be lost. Are You Sure?',
      buttons: ['Delete Wallet File', 'Cancel']
    };
    await fileSystemService.deleteFile({ fileName: walletFiles[0], options, reloadOnDelete: true });
    dispatch({ type: DELETE_WALLET_FILE });
  } catch (err) {
    throw new Error(err);
  }
};
