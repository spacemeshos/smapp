// @flow
import { Action, Dispatch, GetState, WalletMeta, Account, TxList, Tx, Contact } from '/types';
import { fileEncryptionService } from '/infra/fileEncryptionService';
import { cryptoService } from '/infra/cryptoService';
import { fileSystemService } from '/infra/fileSystemService';
import { httpService } from '/infra/httpService';
import { smColors, cryptoConsts } from '/vars';

export const DERIVE_ENCRYPTION_KEY: string = 'DERIVE_ENCRYPTION_KEY';

export const SET_WALLET_META: string = 'SET_WALLET_META';
export const SET_ACCOUNTS: string = 'SET_ACCOUNTS';
export const SET_CURRENT_ACCOUNT_INDEX: string = 'SET_CURRENT_ACCOUNT_INDEX';
export const SET_MNEMONIC: string = 'SET_MNEMONIC';
export const SET_TRANSACTIONS: string = 'SET_TRANSACTIONS';
export const SET_CONTACTS: string = 'SET_CONTACTS';
export const SET_LAST_USED_ADDRESSES: string = 'SET_LAST_USED_ADDRESSES';

export const INCREMENT_WALLET_NUMBER: string = 'INCREMENT_WALLET_NUMBER';
export const INCREMENT_ACCOUNT_NUMBER: string = 'INCREMENT_ACCOUNT_NUMBER';

export const SAVE_WALLET_FILES = 'SAVE_WALLET_FILES';

export const GET_BALANCE: string = 'GET_BALANCE';
export const GET_CONTACTS: string = 'GET_CONTACTS';

export const SEND_TX: string = 'SEND_TX';

export const deriveEncryptionKey = ({ passphrase }: { passphrase: string }): Action => {
  const salt = cryptoConsts.DEFAULT_SALT;
  const key = fileEncryptionService.createEncryptionKey({ passphrase, salt });
  return { type: DERIVE_ENCRYPTION_KEY, payload: { key } };
};

// TODO: remove stub
const transactionsStub: TxList = [
  {
    isSent: true,
    isPending: true,
    amount: 4.0002,
    address: 'HZp1AH1b2xO6ZBZhvNQVHLrn8FXFzZtLlWWqnZE4FU0sNzpkOCSVq9idVO9uDtJg',
    date: new Date('May 29, 2019 03:24:00')
  },
  {
    isSent: false,
    isPending: true,
    amount: 10.5,
    address: 'e6xPhtekueVw9OLG1mE8PAdw4V6fOpr9xpWIV5nsAklJ1wHgrdFfP2rqXxh3zL1e',
    date: new Date('May 22, 2019 12:21:00')
  },
  {
    isSent: true,
    amount: 3.001,
    address: 'n86xGNbMdVHI4gRGeVFsv0JmcXCX0SXLO7RkK42BjjaSZhkrZGYChfkDm7ZwC7h4',
    date: new Date('May 3, 2019 00:24:00')
  },
  {
    isSent: true,
    amount: 26564.22,
    address: 'HZp1AH1b2xO6ZBZhvNQVHLrn8FXFzZtLlWWqnZE4FU0sNzpkOCSVq9idVO9uDtJg',
    date: new Date('April 29, 2019 02:54:00')
  },
  {
    isSent: false,
    isRejected: true,
    amount: 122,
    address: 'HZp1AH1b2xO6ZBZhvNQVHLrn8FXFzZtLlWWqnZE4FU0sNzpkOCSVq9idVO9uDtJg',
    date: new Date('March 9, 2019 03:26:10')
  },
  {
    isSent: true,
    isRejected: true,
    amount: 54894,
    address: '3n8NVi91qt6xNJyDnTyz8MZGATWN95id6nGvifvt5sY914AKoDL1oXR96IKmR2Fp',
    date: new Date('February 27, 2019 12:44:02')
  },
  {
    isSent: true,
    isPending: true,
    amount: 3.0002,
    address: 'r5SYTyA81QyqqMy0vH1ynxeRbZ4C3w2qPswCqRUjreHtMJQr3XuE5ijwjyBMvZop',
    date: new Date('February 19, 2019 05:54:44')
  },
  {
    isSent: false,
    isPending: true,
    amount: 10.0,
    address: '3n8NVi91qt6xNJyDnTyz8MZGATWN95id6nGvifvt5sY914AKoDL1oXR96IKmR2Fp',
    date: new Date('February 18, 2019 03:21:05')
  },
  {
    isSent: true,
    amount: 99.001,
    address: 'y6qG3W2uzXzLeIo4bgFy6vpUWBEnaVsnb4uvOI7AOAjdpRjPrgzsrCWVBrVXSD5C',
    date: new Date('February 13, 2019 03:23:00')
  },
  {
    isSent: true,
    amount: 16564,
    address: 'I3ppGfy6xxnaH88mDyuvGWAKwzqX2HXz4RNPloTEqiHiPXXHz8zBHkMISApaQ34p',
    date: new Date('February 13, 2019 02:23:30')
  },
  {
    isSent: false,
    amount: 254,
    address: 'odrJYaU03w8dR0bo0jA0DtU5JW4Lie9fwXpMLRjdSBqePGsB7pYq8BMz56DPdOGE',
    date: new Date('January 10, 2019 01:14:50')
  },
  {
    isSent: true,
    isRejected: true,
    amount: 4.0034,
    address: '96p8s1L01JlpR9keU8j01urd6Wn1MHGCcFuP5yN6iiGrE4wmoim0kk8cCHB2BpQf',
    date: new Date('December 24, 2019 06:34:46')
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
  const transactions = { '0': transactionsStub }; // TODO: change to empty array after complete transaction flow is ready
  const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify(cipherText), key: fileKey });
  const fileName = `my_wallet_${walletNumber}-${unixEpochTimestamp}.json`;
  const fullWalletDataToFlush = { meta, crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData }, transactions, contacts: [] };
  try {
    fileSystemService.saveFile({ fileName, fileContent: JSON.stringify(fullWalletDataToFlush), showDialog: false });
    dispatch(setWalletMeta({ meta }));
    dispatch(setAccounts({ accounts: cipherText.accounts }));
    dispatch(setMnemonic({ mnemonic: resolvedMnemonic }));
    dispatch(setCurrentAccount({ index: 0 }));
    dispatch(setTransactions({ transactions }));
    dispatch(setLastUsedAddresses({ transactions }));
    dispatch(setContacts({ contacts: [] }));
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

export const setLastUsedAddresses = ({ transactions }: { transactions: TxList }): Action => ({ type: SET_LAST_USED_ADDRESSES, payload: { transactions } });

export const setContacts = ({ contacts }: { contacts: Contact[] }): Action => ({ type: SET_CONTACTS, payload: { contacts } });

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
    dispatch(setLastUsedAddresses({ transactions: file.transactions }));
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

export const addTransaction = ({ tx, accountPK }: { tx: Tx, accountPK?: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { accounts, transactions, currentAccountIndex, walletFiles } = getState().wallet;
    const index = accountPK ? accounts.findIndex((account) => account.pk === accountPK) : currentAccountIndex;
    const updatedTransactions = { ...transactions, [index]: [tx, ...transactions[index]] };
    await fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'transactions', data: updatedTransactions });
    dispatch(setTransactions({ transactions: updatedTransactions }));
  } catch (error) {
    throw new Error(error);
  }
};

export const updateTransaction = ({ tx, updateAll, accountPK }: { tx: Tx, updateAll: boolean, accountPK?: string }): Action => async (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
  try {
    const { accounts, transactions, currentAccountIndex, walletFiles } = getState().wallet;
    const index = accountPK ? accounts.findIndex((account) => account.pk === accountPK) : currentAccountIndex;
    let transactionsArray: TxList = [];
    if (updateAll) {
      transactionsArray = transactions[index].map((transaction: Tx) => (transaction.address === tx.address ? { ...transaction, ...tx } : transaction));
    } else {
      const txIndex = transactions.findIndex((transaction: Tx) => transaction.address === tx.address);
      transactionsArray = [...transactions[index].slice(0, txIndex), tx, ...transactions[index].slice(txIndex + 1)];
    }
    const updatedTransactions = { ...transactions, [index]: transactionsArray };
    await fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'transactions', data: updatedTransactions });
    dispatch(setTransactions({ transactions: updatedTransactions }));
    dispatch(setLastUsedAddresses({ transactions: updatedTransactions }));
  } catch (error) {
    throw new Error(error);
  }
};

export const addToContacts = ({ contact }: Contact): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { contacts, walletFiles } = getState().wallet;
    const updatedContacts = [contact, ...contacts];
    await fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'contacts', data: updatedContacts });
    dispatch(setContacts({ contacts: updatedContacts }));
  } catch (error) {
    throw new Error(error);
  }
};

export const updateWalletMeta = ({ metaFieldName, data }: { metaFieldName: string, data: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { meta, walletFiles } = getState().wallet;
    const updatedMeta = { ...meta, [metaFieldName]: data };
    await fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'meta', data: updatedMeta });
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
