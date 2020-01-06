// @flow
import { Action, Dispatch, GetState, WalletMeta, Account, TxList, Tx, Contact } from '/types';
import { fileEncryptionService } from '/infra/fileEncryptionService';
import { cryptoService } from '/infra/cryptoService';
import { fileSystemService } from '/infra/fileSystemService';
import { httpService } from '/infra/httpService';
import { localStorageService } from '/infra/storageService';
import { createError, fromHexString, asyncForEach, getAddress } from '/infra/utils';
import { cryptoConsts } from '/vars';
import TX_STATUSES from '/vars/enums';

export const SET_WALLET_META: string = 'SET_WALLET_META';
export const SET_ACCOUNTS: string = 'SET_ACCOUNTS';
export const SET_CURRENT_ACCOUNT_INDEX: string = 'SET_CURRENT_ACCOUNT_INDEX';
export const SET_MNEMONIC: string = 'SET_MNEMONIC';
export const SET_TRANSACTIONS: string = 'SET_TRANSACTIONS';
export const SET_CONTACTS: string = 'SET_CONTACTS';

export const SAVE_WALLET_FILES = 'SAVE_WALLET_FILES';

export const SET_BALANCE: string = 'SET_BALANCE';

export const SET_UPDATE_DOWNLOADING: string = 'IS_UPDATE_DOWNLOADING';

const getWalletName = ({ walletNumber }) => (walletNumber > 0 ? `Wallet ${walletNumber}` : 'Main Wallet');

const getAccountName = ({ accountNumber }) => (accountNumber > 0 ? `Account ${accountNumber}` : 'Main Account');

const getMaxLayerId = ({ transactions }) => {
  let max = 0;
  transactions.forEach((transaction) => {
    if (max < transaction.layerId) {
      max = transaction.layerId;
    }
  });
  return max;
};

const getNewAccountFromTemplate = ({ accountNumber, timestamp, publicKey, secretKey }: { accountNumber: number, timestamp: string, publicKey: string, secretKey: string }) => ({
  displayName: getAccountName({ accountNumber }),
  created: timestamp,
  path: `0/0/${accountNumber}`,
  publicKey,
  secretKey
});

export const createNewWallet = ({ mnemonic, key }: { mnemonic?: string, key: string }): Action => async (dispatch: Dispatch): Dispatch => {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const walletNumber = localStorageService.get('walletNumber') || 0;
  const accountNumber = localStorageService.get('accountNumber') || 0;
  const resolvedMnemonic = mnemonic || cryptoService.generateMnemonic();
  const { publicKey, secretKey } = cryptoService.generateKeyPair({ mnemonic: resolvedMnemonic });
  const meta = {
    displayName: getWalletName({ walletNumber }),
    created: timestamp,
    netId: 0,
    meta: { salt: cryptoConsts.DEFAULT_SALT }
  };
  const cipherText = {
    mnemonic: resolvedMnemonic,
    accounts: [getNewAccountFromTemplate({ accountNumber, timestamp, publicKey, secretKey })]
  };
  const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify(cipherText), key });
  const fileName = `my_wallet_${walletNumber}_${timestamp}.json`;
  const fullWalletDataToFlush = {
    meta,
    crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData },
    transactions: [{ layerId: 0, data: [] }],
    contacts: []
  };
  try {
    await fileSystemService.saveFile({ fileName, fileContent: JSON.stringify(fullWalletDataToFlush) });
    dispatch(setWalletMeta({ meta, cipherText: encryptedAccountsData }));
    dispatch(setAccounts({ accounts: cipherText.accounts }));
    dispatch(setMnemonic({ mnemonic: resolvedMnemonic }));
    dispatch(setTransactions({ transactions: [{ layerId: 0, data: [] }] }));
    localStorageService.set('walletNumber', walletNumber + 1);
    localStorageService.set('accountNumber', accountNumber + 1);
    dispatch(readWalletFiles());
  } catch (err) {
    throw createError('Error saving new wallet!', () => createNewWallet({ mnemonic, key }));
  }
};

export const setWalletMeta = ({ meta, cipherText }: { meta: WalletMeta, cipherText: string }): Action => ({ type: SET_WALLET_META, payload: { meta, cipherText } });

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
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: [] } });
    return [];
  }
};

export const unlockWallet = ({ key }: { key: Uint8Array }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { walletFiles } = getState().wallet;
    const file = await fileSystemService.readFile({ filePath: walletFiles[0] });
    const decryptedDataJSON = fileEncryptionService.decryptData({ data: file.crypto.cipherText, key });
    const decryptedData = JSON.parse(decryptedDataJSON);
    dispatch(setWalletMeta({ meta: file.meta, cipherText: file.crypto.cipherText }));
    dispatch(setAccounts({ accounts: decryptedData.accounts }));
    dispatch(setMnemonic({ mnemonic: decryptedData.mnemonic }));
    dispatch(setTransactions({ transactions: file.transactions }));
    dispatch(setContacts({ contacts: file.contacts }));
    dispatch(setCurrentAccount({ index: 0 }));
  } catch (err) {
    throw createError(err.message, () => unlockWallet({ key }));
  }
};

export const getBalance = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { accounts, currentAccountIndex } = getState().wallet;
    const balance = await httpService.getBalance({ address: accounts[currentAccountIndex].publicKey });
    dispatch({ type: SET_BALANCE, payload: { balance } });
  } catch (error) {
    if (typeof error.details === 'string' && error.details.includes('account does not exist')) {
      dispatch({ type: SET_BALANCE, payload: { balance: 0 } });
    } else {
      throw createError('Error getting balance!', getBalance);
    }
  }
};

export const sendTransaction = ({ recipient, amount, fee, note }: { recipient: string, amount: number, fee: number, note: string }): Action => async (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
  try {
    const { accounts, currentAccountIndex } = getState().wallet;
    const accountNonce = await httpService.getNonce({ address: accounts[currentAccountIndex].publicKey });
    const tx = await cryptoService.signTransaction({
      accountNonce,
      recipient,
      price: fee,
      amount,
      secretKey: accounts[currentAccountIndex].secretKey
    });
    const txId = await httpService.sendTx({ tx });
    dispatch(
      addTransaction({
        tx: {
          txId,
          sender: getAddress(accounts[currentAccountIndex].publicKey),
          receiver: getAddress(recipient),
          amount,
          fee,
          status: TX_STATUSES.PENDING,
          timestamp: new Date().getTime(),
          note
        }
      })
    );
    return txId;
  } catch (error) {
    throw createError('Error sending transaction!', () => sendTransaction({ recipient, amount, fee, note }));
  }
};

export const addTransaction = ({ tx, accountPK }: { tx: Tx, accountPK?: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { accounts, transactions, currentAccountIndex } = getState().wallet;
    const index: number = accountPK ? accounts.findIndex((account) => account.publicKey === accountPK) : currentAccountIndex;
    const updatedTransactions = [
      ...transactions.slice(0, index),
      { layerId: transactions[index].layerId, data: [{ ...tx }, ...transactions[index].data] },
      ...transactions.slice(index + 1)
    ];
    dispatch(setTransactions({ transactions: updatedTransactions }));
  } catch (error) {
    throw createError(error.message, () => addTransaction({ tx, accountPK }));
  }
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
    dispatch(setTransactions({ transactions: updatedTransactions, fileName: walletFiles[0] }));
  } catch (error) {
    throw createError(error.message, () => updateTransaction({ tx, updateAll, accountPK }));
  }
};

const mergeTxStatuses = ({ existingList, incomingList, address }: { existingList: TxList, incomingList: TxList, address: string }) => {
  const unifiedTxList = [...existingList];
  let hasConfirmedIncomingTxs = false;
  let hasConfirmedOutgoingTxs = false;
  const existingListMap = {};
  existingList.forEach((tx, index) => {
    existingListMap[tx.txId] = { index, tx };
  });
  incomingList.forEach((tx) => {
    if (existingListMap[tx.txId]) {
      hasConfirmedIncomingTxs =
        !hasConfirmedIncomingTxs && existingListMap[tx.txId].tx.status !== TX_STATUSES.CONFIRMED && tx.status === TX_STATUSES.CONFIRMED && tx.receiver === address;
      hasConfirmedOutgoingTxs =
        !hasConfirmedOutgoingTxs && existingListMap[tx.txId].tx.status !== TX_STATUSES.CONFIRMED && tx.status === TX_STATUSES.CONFIRMED && tx.receiver !== address;
      unifiedTxList[existingListMap[tx.txId].index] = tx.timestamp ? tx : { ...tx, timestamp: existingListMap[tx.txId].tx.timestamp };
    } else {
      hasConfirmedIncomingTxs = !hasConfirmedIncomingTxs && tx.status === TX_STATUSES.CONFIRMED && tx.receiver === address;
      unifiedTxList.push(tx.timestamp ? tx : { ...tx, timestamp: new Date().getTime() });
    }
  });
  return { unifiedTxList, hasConfirmedIncomingTxs, hasConfirmedOutgoingTxs };
};

export const getTxList = ({ notify }: { notify: Function }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { isConnected } = getState().node;
  if (isConnected) {
    try {
      const { accounts, transactions } = getState().wallet;
      let updatedTransactions = [];

      // for given account and it's tx ids list get full tx data
      const fullTxDataCollector = async (txIds: Array<string>, collector: Array<Tx>) => {
        await asyncForEach(txIds, async (txId) => {
          const tx = await httpService.getTransaction({ id: fromHexString(txId.substring(2)) });
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
          transactions[index].data.forEach((existingTx) => {
            if (!txs.includes(`0x${existingTx.txId}`) && existingTx.status === TX_STATUSES.PENDING) {
              txs.push(`0x${existingTx.txId}`);
            }
          });
          const fullDataTxsList = [];
          await fullTxDataCollector(txs, fullDataTxsList);
          const { unifiedTxList, hasConfirmedIncomingTxs, hasConfirmedOutgoingTxs } = mergeTxStatuses({
            existingList: transactions[index].data,
            incomingList: fullDataTxsList,
            address: account.publicKey
          });
          if (hasConfirmedIncomingTxs || hasConfirmedOutgoingTxs) {
            notify({ hasConfirmedIncomingTxs });
          }
          updatedTransactions = [...transactions.slice(0, index), { layerId: minValidatedLayer, data: unifiedTxList }, ...transactions.slice(index + 1)];
        });
      };
      await txListCollector();
      dispatch(setTransactions({ transactions: updatedTransactions }));
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  }
};

export const createNewAccount = ({ key }: { key: Uint8Array }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { mnemonic, accounts, transactions, meta } = getState().wallet;
  const { publicKey, secretKey } = cryptoService.deriveNewKeyPair({ mnemonic, index: accounts.length, salt: cryptoConsts.DEFAULT_SALT });
  const timestamp = new Date().toISOString().replace(/:/, '-');
  const accountNumber = localStorageService.get('accountNumber');
  const newAccount = getNewAccountFromTemplate({ accountNumber, timestamp, publicKey, secretKey });
  const updatedAccounts = [...accounts, newAccount];
  dispatch(setAccounts({ accounts: updatedAccounts }));
  dispatch(setTransactions({ transactions: [...transactions, { layerId: getMaxLayerId({ transactions }), data: [] }] }));
  const cipherText = fileEncryptionService.encryptData({ data: JSON.stringify({ mnemonic, accounts: updatedAccounts }), key });
  dispatch(setWalletMeta({ meta, cipherText }));
  localStorageService.set('accountNumber', accountNumber + 1);
};

export const updateAccountName = ({ accountIndex, fieldName, data, key }: { accountIndex: number, fieldName: string, data: string, key: Uint8Array }): Action => async (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
  const { accounts, mnemonic, meta } = getState().wallet;
  const updatedAccount = { ...accounts[accountIndex], [fieldName]: data };
  const updatedAccounts = [...accounts.slice(0, accountIndex), updatedAccount, ...accounts.slice(accountIndex + 1)];
  dispatch(setAccounts({ accounts: updatedAccounts }));
  const cipherText = fileEncryptionService.encryptData({ data: JSON.stringify({ mnemonic, accounts: updatedAccounts }), key });
  dispatch(setWalletMeta({ meta, cipherText }));
};

export const addToContacts = ({ contact }: Contact): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { contacts } = getState().wallet;
  const updatedContacts = [contact, ...contacts];
  dispatch(setContacts({ contacts: updatedContacts }));
};

export const updateWalletName = ({ displayName }: { displayName: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { meta, cipherText } = getState().wallet;
  const updatedMeta = { ...meta, displayName };
  dispatch(setWalletMeta({ meta: updatedMeta, cipherText }));
};

export const updateWalletFile = ({ key }: { key?: Uint8Array }): Action => (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { walletFiles, meta, cipherText, transactions, contacts } = getState().wallet;
  const immediateUpdate = !!key;
  fileSystemService.updateWalletFile({ fileName: walletFiles[0], data: { crypto: { cipher: 'AES-128-CTR', cipherText }, meta, transactions, contacts }, immediateUpdate });
};

export const copyFile = ({ filePath }: { fileName: string, filePath: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { walletFiles } = getState().wallet;
  const walletNumber = localStorageService.get('walletNumber');
  const fileName = `my_wallet_${walletNumber}-${new Date().toISOString().replace(/:/, '-')}.json`;
  const newFilePath = await fileSystemService.copyFile({ fileName, filePath });
  localStorageService.set('walletNumber', walletNumber + 1);
  dispatch({ type: SAVE_WALLET_FILES, payload: { files: walletFiles ? [newFilePath, ...walletFiles] : [newFilePath] } });
};

export const backupWallet = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { walletFiles } = getState().wallet;
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName = `Wallet_Backup_${timestamp}.json`;
    await fileSystemService.copyFile({ fileName: '', filePath: walletFiles[0], newFileName: fileName, saveToDocumentsFolder: true });
    localStorageService.set('hasBackup', true);
    localStorageService.set('lastBackupTime', timestamp);
  } catch (error) {
    throw createError('Error creating wallet backup!', backupWallet);
  }
};

export const setUpdateDownloading = ({ isUpdateDownloading }: { isUpdateDownloading: boolean }): Action => ({ type: SET_UPDATE_DOWNLOADING, payload: { isUpdateDownloading } });
