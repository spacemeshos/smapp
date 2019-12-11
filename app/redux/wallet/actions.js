// @flow
import { Action, Dispatch, GetState, WalletMeta, Account, TxList, Tx, Contact } from '/types';
import { fileEncryptionService } from '/infra/fileEncryptionService';
import { cryptoService } from '/infra/cryptoService';
import { fileSystemService } from '/infra/fileSystemService';
import { httpService } from '/infra/httpService';
import { localStorageService } from '/infra/storageService';
import { getWalletName, getAccountName, createError, fromHexString, toHexString, asyncForEach } from '/infra/utils';
import { cryptoConsts } from '/vars';
import TX_STATUSES from '/vars/enums';

export const STORE_ENCRYPTION_KEY: string = 'STORE_ENCRYPTION_KEY';

export const SET_WALLET_META: string = 'SET_WALLET_META';
export const SET_ACCOUNTS: string = 'SET_ACCOUNTS';
export const SET_CURRENT_ACCOUNT_INDEX: string = 'SET_CURRENT_ACCOUNT_INDEX';
export const SET_MNEMONIC: string = 'SET_MNEMONIC';
export const SET_TRANSACTIONS: string = 'SET_TRANSACTIONS';
export const SET_CONTACTS: string = 'SET_CONTACTS';

export const SAVE_WALLET_FILES = 'SAVE_WALLET_FILES';

export const SET_BALANCE: string = 'SET_BALANCE';

export const SET_UPDATE_DOWNLOADING: string = 'IS_UPDATE_DOWNLOADING';

const getMaxLayerId = ({ transactions }) => {
  let max = 0;
  transactions.forEach((transaction) => {
    if (max < transaction.layerId) {
      max = transaction.layerId;
    }
  });
  return max;
};

const getNewAccountFromTemplate = ({ accountNumber, unixEpochTimestamp, publicKey, secretKey, layerId }) => ({
  displayName: getAccountName({ accountNumber }),
  created: unixEpochTimestamp,
  path: `0/0/${accountNumber}`,
  publicKey,
  secretKey,
  layerId
});

const mergeTxStatuses = ({ existingList, incomingList, address }: { existingList: TxList, incomingList: TxList, address: string }) => {
  const unifiedTxList = [...existingList];
  let hasConfirmedIncomingTxs = false;
  let hasConfirmedOutgoingTxs = false;
  const existingListMap = {};
  existingList.forEach((tx, index) => {
    existingListMap[tx.id] = { index, tx };
  });
  incomingList.forEach((tx) => {
    if (existingListMap[tx.txId]) {
      hasConfirmedIncomingTxs = !hasConfirmedIncomingTxs && tx.txId.tx.status !== TX_STATUSES.CONFIRMED && tx.status === TX_STATUSES.CONFIRMED && tx.receiver === address;
      hasConfirmedOutgoingTxs = !hasConfirmedOutgoingTxs && tx.txId.tx.status !== TX_STATUSES.CONFIRMED && tx.status === TX_STATUSES.CONFIRMED && tx.receiver !== address;
      unifiedTxList[existingListMap[tx.txId.index]] = tx;
    } else {
      hasConfirmedIncomingTxs = !hasConfirmedIncomingTxs && tx.status === TX_STATUSES.CONFIRMED && tx.receiver === address;
      unifiedTxList.push(tx);
    }
  });
  return { unifiedTxList, hasConfirmedIncomingTxs, hasConfirmedOutgoingTxs };
};

export const generateEncryptionKey = ({ password }: { password: string }): Action => {
  const salt = cryptoConsts.DEFAULT_SALT;
  const key = fileEncryptionService.createEncryptionKey({ password, salt });
  return { type: STORE_ENCRYPTION_KEY, payload: { key } };
};

export const saveNewWallet = ({ mnemonic }: { mnemonic?: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { fileKey, walletFiles } = getState().wallet;
  const unixEpochTimestamp = Math.floor(new Date() / 1000);
  const walletNumber = localStorageService.get('walletNumber') || 0;
  const accountNumber = localStorageService.get('accountNumber') || 0;
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
    transactions: [{ layerId: 0, data: [] }],
    contacts: []
  };
  try {
    fileSystemService.saveFile({ fileName, fileContent: JSON.stringify(fullWalletDataToFlush) });
    dispatch(setWalletMeta({ meta }));
    dispatch(setAccounts({ accounts: cipherText.accounts }));
    dispatch(setMnemonic({ mnemonic: resolvedMnemonic }));
    dispatch(setTransactions({ transactions: [{ layerId: 0, data: [] }] }));
    dispatch(setContacts({ contacts: [] }));
    dispatch(setCurrentAccount({ index: 0 }));
    localStorageService.set('walletNumber', walletNumber + 1);
    localStorageService.set('accountNumber', accountNumber + 1);
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: walletFiles ? [fileName, ...walletFiles] : [fileName] } });
  } catch (err) {
    throw createError('Error saving new wallet!', () => saveNewWallet({ mnemonic }));
  }
};

export const setWalletMeta = ({ meta }: { meta: WalletMeta }): Action => ({ type: SET_WALLET_META, payload: { meta } });

export const setAccounts = ({ accounts }: { accounts: Account[] }): Action => ({ type: SET_ACCOUNTS, payload: { accounts } });

export const setCurrentAccount = ({ index }: { index: number }): Action => (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { transactions } = getState().wallet;
  dispatch({ type: SET_CURRENT_ACCOUNT_INDEX, payload: { index } });
  dispatch(setTransactions({ transactions }));
};

export const setMnemonic = ({ mnemonic }: { mnemonic: string }): Action => ({ type: SET_MNEMONIC, payload: { mnemonic } });

export const setTransactions = ({ transactions }: { transactions: TxList }): Action => ({ type: SET_TRANSACTIONS, payload: { transactions } });

export const setContacts = ({ contacts }: { contacts: Contact[] }): Action => ({ type: SET_CONTACTS, payload: { contacts } });

export const readWalletFiles = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const files = await fileSystemService.readDirectory();
    dispatch({ type: SAVE_WALLET_FILES, payload: { files } });
    return files;
  } catch (err) {
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: [] } });
    return [];
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
    const balance = await httpService.getBalance({ address: accounts[currentAccountIndex].publicKey.slice(12) });
    dispatch({ type: SET_BALANCE, payload: { balance } });
  } catch (error) {
    if (typeof error === 'string' && error.includes('account does not exist')) {
      dispatch({ type: SET_BALANCE, payload: { balance: 0 } });
    } else {
      throw createError('Error getting balance!', getBalance);
    }
  }
};

export const sendTransaction = ({ recipient, amount, price, note }: { recipient: string, amount: number, price: number, note: string }): Action => async (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
  try {
    const { accounts, currentAccountIndex } = getState().wallet;
    const accountNonce = await httpService.getNonce({ address: fromHexString(accounts[currentAccountIndex].publicKey) });
    const tx = await cryptoService.signTransaction({
      accountNonce,
      recipient: fromHexString(recipient),
      price,
      amount,
      secretKey: fromHexString(accounts[currentAccountIndex].secretKey)
    });
    const txId = await httpService.sendTx({ tx });
    const txIdAsString = toHexString(txId);
    dispatch(
      addTransaction({
        tx: {
          txId: txIdAsString,
          sender: accounts[currentAccountIndex].publicKey,
          receiver: recipient,
          amount,
          fee: price,
          status: TX_STATUSES.PENDING,
          timestamp: Math.floor(new Date() / 1000),
          note
        }
      })
    );
    return txIdAsString;
  } catch (error) {
    throw createError('Error sending transaction!', () => sendTransaction({ recipient, amount, price, note }));
  }
};

export const addTransaction = ({ tx, accountPK }: { tx: Tx, accountPK?: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { accounts, transactions, currentAccountIndex, walletFiles } = getState().wallet;
    const index: number = accountPK ? accounts.findIndex((account) => account.publicKey === accountPK) : currentAccountIndex;
    const updatedTransactions = [
      ...transactions.slice(0, index),
      { layerId: transactions[index].layerId, data: [{ ...tx }, ...transactions[index].data] },
      ...transactions.slice(index + 1)
    ];
    await fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'transactions', data: updatedTransactions });
    dispatch(setTransactions({ transactions: updatedTransactions }));
  } catch (error) {
    throw createError(error.message, () => addTransaction({ tx, accountPK }));
  }
};

export const getTxList = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { accounts, transactions, walletFiles } = getState().wallet;
  let updatedTransactions = [];

  // for given account and it's tx ids list get full tx data
  const fullTxDataCollector = async (txIds: Array<string>, collector: Array<Tx>) => {
    await asyncForEach(txIds, async (txId) => {
      const tx = await httpService.getTransaction({ id: fromHexString(txId) });
      collector.push(tx);
    });
  };

  // get all tx ids for every account, then for each account get full tx data for the list
  const txListCollector = async () => {
    let minValidatedLayer = 0;
    await asyncForEach(accounts, async (account, index) => {
      const { txs, validatedLayer } = await httpService.getAccountTxs({ startLayer: transactions[index].layerId, account: account.publicKey });
      if (minValidatedLayer === 0) {
        minValidatedLayer = validatedLayer;
      }
      const fullDataTxsList = [];
      await fullTxDataCollector(txs, fullDataTxsList);
      const { unifiedTxList } = mergeTxStatuses({
        existingList: transactions[index],
        incomingList: fullDataTxsList,
        address: account.publicKey
      });
      updatedTransactions = [...transactions.slice(0, index), { layerId: minValidatedLayer, data: unifiedTxList }, ...transactions.slice(index + 1)];
    });
  };
  await txListCollector();
  await fileSystemService.updateFile({ fileName: walletFiles[0], fieldName: 'transactions', data: updatedTransactions });
  dispatch(setTransactions({ transactions: updatedTransactions }));
};

export const updateTransaction = ({ tx, updateAll, accountPK }: { tx: Tx, updateAll: boolean, accountPK?: string }): Action => async (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
  try {
    const { accounts, transactions, currentAccountIndex, walletFiles } = getState().wallet;
    const index: number = accountPK ? accounts.findIndex((account) => account.publicKey === accountPK) : currentAccountIndex;
    let transactionsArray: TxList = [];
    if (updateAll) {
      transactionsArray = transactions[index].data.map((transaction: Tx) => (transaction.address === tx.address ? { ...transaction, ...tx } : transaction));
    } else {
      const txIndex = transactions[index].data.findIndex((transaction: Tx) => transaction.id === tx.id);
      transactionsArray = [...transactions[index].data.slice(0, txIndex), tx, ...transactions[index].data.slice(txIndex + 1)];
    }
    const updatedTransactions = [...transactions.slice(0, index), { layerId: transactions[index].layerId, data: transactionsArray }, ...transactions.slice(index + 1)];
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
    const timestamp = now.toISOString().replace(/:/, '-');
    const fileName = `Wallet_Backup_${timestamp}.json`;
    await fileSystemService.saveFile({ fileName, fileContent: JSON.stringify(encryptedWallet), saveToDocumentsFolder: true });
    localStorageService.set('hasBackup', true);
    localStorageService.set('lastBackupTime', timestamp);
  } catch (error) {
    throw createError('Error creating wallet backup!', backupWallet);
  }
};

export const setUpdateDownloading = ({ isUpdateDownloading }: { isUpdateDownloading: boolean }): Action => ({ type: SET_UPDATE_DOWNLOADING, payload: { isUpdateDownloading } });
