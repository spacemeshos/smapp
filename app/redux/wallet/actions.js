// @flow
import { Action, Dispatch, GetState, WalletMeta, Account, TxList, Tx, Contact } from '/types';
import { fileEncryptionService } from '/infra/fileEncryptionService';
import { cryptoService } from '/infra/cryptoService';
import { fileSystemService } from '/infra/fileSystemService';
import { httpService } from '/infra/httpService';
import { localStorageService } from '/infra/storageService';
import { getWalletName, getAccountName, fromHexString, createError } from '/infra/utils';
import { cryptoConsts } from '/vars';

export const STORE_ENCRYPTION_KEY: string = 'STORE_ENCRYPTION_KEY';

export const SET_WALLET_META: string = 'SET_WALLET_META';
export const SET_ACCOUNTS: string = 'SET_ACCOUNTS';
export const SET_CURRENT_ACCOUNT_INDEX: string = 'SET_CURRENT_ACCOUNT_INDEX';
export const SET_MNEMONIC: string = 'SET_MNEMONIC';
export const SET_TRANSACTIONS: string = 'SET_TRANSACTIONS';
export const SET_CONTACTS: string = 'SET_CONTACTS';

export const SAVE_WALLET_FILES = 'SAVE_WALLET_FILES';

export const SET_BALANCE: string = 'SET_BALANCE';

// TODO: Remove this - test only
const transactionsMockData: TxList = [
  {
    id: '5ec09b2b5356f11f2ab61060d8b35b5c',
    isSent: true,
    amount: 3.002,
    address: '0c183911b5758beb0ab1d93c9a1df4c8987531231bfbb931f0e4b304245089fc',
    nickname: 'Nancy Sinatra',
    date: 1566376292918,
    isSavedContact: true,
    note: 'This is a test sent transaction of saved contact'
  },
  {
    id: 'f03fecce4ded576ac6d64568497b7350',
    isSent: false,
    amount: 15.323,
    address: '383d06ca9f6cfe56f7aff4bc5129cba2591af0ff7c2f7671bfa065ecfca9ed8e',
    nickname: 'Miles Davis',
    date: 1566376291918,
    isSavedContact: true,
    note: 'This is a test received transaction of saved contact'
  },
  {
    id: '6edd673d45d01794551fa77ffb5b820f',
    isSent: false,
    isPending: true,
    amount: 5.3,
    address: '445407f0d5c58abdd36b22be971d3b5074415a5df0aac2ac251ef68142525fa8',
    date: 1566376281918,
    isSavedContact: false,
    note: 'This is a test received pending transaction'
  },
  {
    id: '10ad45d657d615d698764d89b2be2d0b',
    isSent: true,
    isPending: true,
    amount: 43.1,
    address: '436ac1cc602b908d62023e5336f35febee7679dc2737df3d97a98aaeb0972edd',
    date: 1566376261918,
    isSavedContact: false,
    note: 'This is a test sent pending transaction'
  },
  {
    id: '91a82d0305c24880ea9ab03b2417fa59',
    isSent: false,
    isPending: true,
    amount: 600.231,
    address: '00f5fa98b48f35cb4407c23741ee5969b5279c31761bd0a40c33df6a3238e86a',
    nickname: 'Eric Clapton',
    date: 1566374261918,
    isSavedContact: true,
    note: 'This is a test received pending transaction of saved contact'
  },
  {
    id: '9b27e2932aac86d11e59fcbb9e180b0f',
    isSent: true,
    isRejected: true,
    amount: 60.95,
    address: 'd9e6f74d65fcdad4ef37a4e91f9f7c3f8614abad1380119de29e31234e8a549f',
    nickname: 'Elton John',
    date: 1566314261918,
    isSavedContact: true,
    note: 'This is a test sent rejected transaction of saved contact'
  },
  {
    id: '46572fa6b09715896dab402457bf4f8e',
    isSent: true,
    amount: 46.22,
    address: '03a5c18ca837474b5af1ddaac2b7d7eee7c5cfa3d2336af6f67b50de16a4aa46',
    date: 1565314261918,
    isSavedContact: false,
    note: 'This is a test sent transaction'
  },
  {
    id: '64475d9b037d40480edd56261aa9a136',
    isSent: false,
    isPending: true,
    amount: 16.321,
    address: '9112720e0ac5f2bc583206358d7b1e6bd532abc01db6a9eaf0b303dcae3e3ea3',
    date: 1565314261918,
    isSavedContact: false,
    note: 'This is a test received pending transaction'
  },
  {
    id: 'fcbd39edb90f6d2d90e9dd67a1d97d35',
    isSent: false,
    amount: 73.5,
    address: '00f15217df1e84254831be13697da675c6a55b4050e2de30668961f478af8c43',
    date: 1561313261918,
    isSavedContact: false
  },
  {
    id: 'd83057fccac1b99356b9b3976b5e14be',
    isSent: true,
    amount: 30.97,
    address: 'db10f5d9f8b7239cf8f215d96a28d7f4f16ca678c34c9ac1d7a97670b86361b3',
    nickname: 'MJ',
    date: 1560203261918,
    isSavedContact: true,
    note: 'This is a test sent rejected transaction of saved contact'
  }
];

const getMaxLayerId = ({ transactions }) => {
  let max = 0;
  Object.keys(transactions).forEach((key) => {
    if (max < transactions[key].layerId) {
      max = transactions[key].layerId;
    }
  });
  return max;
};

const getNewAccountFromTemplate = ({ accountNumber, unixEpochTimestamp, publicKey, secretKey, layerId }) => ({
  displayName: getAccountName({ accountNumber }),
  created: unixEpochTimestamp,
  path: `0/0/${accountNumber}`,
  balance: 100, // TODO change to real balance
  pk: publicKey,
  sk: secretKey,
  layerId
});

const mergeTxStatuses = () => {
  // const existingListMap = {};
  // existingList.forEach((tx, index) => {
  //   existingList[tx.id] = index;
  // });
  // const updatedTxList = [];
};

export const generateEncryptionKey = ({ passphrase }: { passphrase: string }): Action => {
  const salt = cryptoConsts.DEFAULT_SALT;
  const key = fileEncryptionService.createEncryptionKey({ passphrase, salt });
  return { type: STORE_ENCRYPTION_KEY, payload: { key } };
};

export const saveNewWallet = ({ mnemonic }: { mnemonic?: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { fileKey, walletFiles } = getState().wallet;
  const unixEpochTimestamp = Math.floor(new Date() / 1000);
  const walletNumber = localStorageService.get('walletNumber');
  const accountNumber = localStorageService.get('accountNumber');
  const resolvedMnemonic = mnemonic || cryptoService.generateMnemonic();
  const { publicKey, secretKey } = cryptoService.generateKeyPair({ mnemonic: resolvedMnemonic });
  const meta = {
    displayName: getWalletName({ walletNumber }),
    created: unixEpochTimestamp,
    netId: 0,
    meta: { salt: cryptoConsts.DEFAULT_SALT }
  };
  const cipherText = {
    mnemonic: resolvedMnemonic,
    accounts: [getNewAccountFromTemplate({ accountNumber, unixEpochTimestamp, publicKey, secretKey, layerId: 0 })]
  };
  const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify(cipherText), key: fileKey });
  const fileName = `my_wallet_${walletNumber}-${unixEpochTimestamp}.json`;
  const fullWalletDataToFlush = {
    meta,
    crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData },
    transactions: { '0': { layerId: 0, data: [...transactionsMockData] } },
    contacts: []
  };
  try {
    fileSystemService.saveFile({ fileName, fileContent: JSON.stringify(fullWalletDataToFlush) });
    dispatch(setWalletMeta({ meta }));
    dispatch(setAccounts({ accounts: cipherText.accounts }));
    dispatch(setMnemonic({ mnemonic: resolvedMnemonic }));
    dispatch(setCurrentAccount({ index: 0 }));
    dispatch(setTransactions({ transactions: { '0': { layerId: 0, data: [...transactionsMockData] } } }));
    dispatch(setContacts({ contacts: [] }));
    localStorageService.set('walletNumber', walletNumber + 1);
    localStorageService.set('accountNumber', accountNumber + 1);
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: walletFiles ? [fileName, ...walletFiles] : [fileName] } });
  } catch (err) {
    throw createError('Error saving new wallet!', () => saveNewWallet({ mnemonic }));
  }
};

export const setWalletMeta = ({ meta }: { meta: WalletMeta }): Action => ({ type: SET_WALLET_META, payload: { meta } });

export const setAccounts = ({ accounts }: { accounts: Account[] }): Action => ({ type: SET_ACCOUNTS, payload: { accounts } });

export const setCurrentAccount = ({ index }: { index: number }): Action => ({ type: SET_CURRENT_ACCOUNT_INDEX, payload: { index } });

export const setMnemonic = ({ mnemonic }: { mnemonic: string }): Action => ({ type: SET_MNEMONIC, payload: { mnemonic } });

export const setTransactions = ({ transactions }: { transactions: TxList }): Action => ({ type: SET_TRANSACTIONS, payload: { transactions } });

export const setContacts = ({ contacts }: { contacts: Contact[] }): Action => ({ type: SET_CONTACTS, payload: { contacts } });

export const readWalletFiles = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const files = await fileSystemService.readDirectory();
    dispatch({ type: SAVE_WALLET_FILES, payload: { files } });
    return files;
  } catch (err) {
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: null } });
    throw createError('Error reading wallet files!', readWalletFiles);
  }
};

export const unlockWallet = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { walletFiles, fileKey } = getState().wallet;
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
    throw createError(err.message, unlockWallet);
  }
};

export const createNewAccount = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { mnemonic, accounts, transactions } = getState().wallet;
    const { publicKey, secretKey } = cryptoService.deriveNewKeyPair({ mnemonic, index: accounts.length, salt: cryptoConsts.DEFAULT_SALT });
    const unixEpochTimestamp = Math.floor(new Date() / 1000);
    const accountNumber = localStorageService.get('accountNumber');
    const newAccount = getNewAccountFromTemplate({ accountNumber, unixEpochTimestamp, publicKey, secretKey, layerId: getMaxLayerId({ transactions }) });
    const updatedAccounts = [...accounts, newAccount];
    await dispatch(updateAccountsInFile({ accounts: updatedAccounts }));
    dispatch(setAccounts({ accounts: updatedAccounts }));
    localStorageService.set('accountNumber', accountNumber + 1);
  } catch (err) {
    throw createError('Error creating new account!', createNewAccount);
  }
};

export const copyFile = ({ filePath }: { fileName: string, filePath: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { walletFiles } = getState().wallet;
  const walletNumber = localStorageService.get('walletNumber');
  const fileName = `my_wallet_${walletNumber}-${Math.floor(new Date() / 1000)}.json`;
  const newFilePath = await fileSystemService.copyFile({ fileName, filePath });
  localStorageService.set('walletNumber', walletNumber + 1);
  dispatch({ type: SAVE_WALLET_FILES, payload: { files: walletFiles ? [newFilePath, ...walletFiles] : [newFilePath] } });
};

export const getBalance = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { accounts, currentAccountIndex } = getState().wallet;
    const balance = await httpService.getBalance({ address: fromHexString(accounts[currentAccountIndex].pk) });
    dispatch({ type: SET_BALANCE, payload: { balance } });
  } catch (error) {
    throw createError('Error getting balance!', getBalance);
  }
};

export const sendTransaction = ({ recipient, amount, price, note }: { recipient: string, amount: number, price: number, note: string }): Action => async (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
  try {
    const { accounts, currentAccountIndex } = getState().wallet;
    const accountNonce = await httpService.getNonce({ address: accounts[currentAccountIndex].pk });
    const tx = await cryptoService.signTransaction({ accountNonce, recipient, price, amount, secretKey: accounts[currentAccountIndex].sk });
    const id = await httpService.sendTx({ tx });
    dispatch(addTransaction({ tx: { id, isSent: true, isPending: true, address: recipient, date: new Date(), amount: amount + price, note } }));
  } catch (error) {
    throw createError('Error sending transaction!', () => sendTransaction({ recipient, amount, price, note }));
  }
};

export const addTransaction = ({ tx, accountPK }: { tx: Tx, accountPK?: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { accounts, transactions, currentAccountIndex, walletFiles } = getState().wallet;
    const index = accountPK ? accounts.findIndex((account) => account.pk === accountPK) : currentAccountIndex;
    const updatedTransactions = { ...transactions, [index]: { layerId: transactions[index].layerId, data: [tx, ...transactions[index].data] } };
    await fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'transactions', data: updatedTransactions });
    dispatch(setTransactions({ transactions: updatedTransactions }));
  } catch (error) {
    throw createError(error.message, () => addTransaction({ tx, accountPK }));
  }
};

export const getTxList = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { currentAccountIndex, transactions, walletFiles } = getState().wallet;
  // const accountTransactions = transactions[currentAccountIndex];
  const latestValidLayerId = await httpService.getLatestValidLayerId();
  // const txList = await httpService.getTxList({ address: accounts[currentAccountIndex].pk, layerId: accountTransactions.layerId });
  const updatedTransactionsPerAccount = mergeTxStatuses(); // mergeTxStatuses({ existingList: accountTransactions, incomingList: txList });
  const updatedTransactions = { ...transactions, [currentAccountIndex]: { layerId: latestValidLayerId, data: updatedTransactionsPerAccount } };
  await fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'transactions', data: updatedTransactions });
  dispatch(setTransactions({ transactions: updatedTransactions }));
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
      transactionsArray = transactions[index].data.map((transaction: Tx) => (transaction.address === tx.address ? { ...transaction, ...tx } : transaction));
    } else {
      const txIndex = transactions[index].data.findIndex((transaction: Tx) => transaction.id === tx.id);
      transactionsArray = [...transactions[index].data.slice(0, txIndex), tx, ...transactions[index].data.slice(txIndex + 1)];
    }
    const updatedTransactions = { ...transactions, [index]: { layerId: transactions[index].layerId, data: transactionsArray } };
    await fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'transactions', data: updatedTransactions });
    dispatch(setTransactions({ transactions: updatedTransactions }));
  } catch (error) {
    throw createError(error.message, () => updateTransaction({ tx, updateAll, accountPK }));
  }
};

export const addToContacts = ({ contact }: Contact): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { contacts, walletFiles } = getState().wallet;
    const updatedContacts = [contact, ...contacts];
    await fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'contacts', data: updatedContacts });
    dispatch(setContacts({ contacts: updatedContacts }));
  } catch (error) {
    throw createError(error.message, () => addToContacts({ contact }));
  }
};

export const updateWalletMeta = ({ metaFieldName, data }: { metaFieldName: string, data: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { meta, walletFiles } = getState().wallet;
    const updatedMeta = { ...meta, [metaFieldName]: data };
    await fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'meta', data: updatedMeta });
    dispatch(setWalletMeta({ meta: updatedMeta }));
  } catch (error) {
    throw createError(error.message, () => updateWalletMeta({ metaFieldName, data }));
  }
};

export const updateAccount = ({ accountIndex, fieldName, data }: { accountIndex: number, fieldName: string, data: any }): Action => async (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
  try {
    const { accounts } = getState().wallet;
    const updatedAccount = { ...accounts[accountIndex], [fieldName]: data };
    const updatedAccounts = [...accounts.slice(0, accountIndex), updatedAccount, ...accounts.slice(accountIndex + 1)];
    await dispatch(updateAccountsInFile({ accounts: updatedAccounts }));
    dispatch(setAccounts({ accounts: updatedAccounts }));
  } catch (error) {
    throw createError(error.message, () => updateAccount({ accountIndex, fieldName, data }));
  }
};

export const updateAccountsInFile = ({ accounts }: { accounts?: Account[] }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { fileKey, mnemonic, walletFiles } = getState().wallet;
  const cipherText = { mnemonic, accounts };
  const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify(cipherText), key: fileKey });
  await fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'crypto', data: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData } });
};

export const backupWallet = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { meta, accounts, mnemonic, transactions, contacts, fileKey } = getState().wallet;
    const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify({ mnemonic, accounts }), key: fileKey });
    const encryptedWallet = { meta, crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData }, transactions, contacts };
    const now = new Date();
    const fileName = `Wallet_Backup_${now.toISOString()}.json`;
    await fileSystemService.saveFile({ fileName, fileContent: JSON.stringify(encryptedWallet), saveToDocumentsFolder: true });
    localStorageService.set('hasBackup', true);
    localStorageService.set('lastBackupTime', now.toISOString());
  } catch (error) {
    throw createError('Error creating wallet backup!', backupWallet);
  }
};
