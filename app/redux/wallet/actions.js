// @flow
import { eventsService } from '/infra/eventsService';
import { cryptoService } from '/infra/cryptoService';
import { localStorageService } from '/infra/storageService';
import { createError, getAddress } from '/infra/utils';
import { Action, Dispatch, GetState, WalletMeta, Account, TxList, Tx, Contact } from '/types';
import TX_STATUSES from '/vars/enums';
import type { AccountTxs } from '../../types/transactions';

export const SET_WALLET_META: string = 'SET_WALLET_META';
export const SET_ACCOUNTS: string = 'SET_ACCOUNTS';
export const SET_CURRENT_ACCOUNT_INDEX: string = 'SET_CURRENT_ACCOUNT_INDEX';
export const SET_MNEMONIC: string = 'SET_MNEMONIC';
export const SET_TRANSACTIONS: string = 'SET_TRANSACTIONS';
export const SET_CONTACTS: string = 'SET_CONTACTS';

export const SAVE_WALLET_FILES = 'SAVE_WALLET_FILES';

export const SET_BALANCE: string = 'SET_BALANCE';

export const SET_UPDATE_DOWNLOADING: string = 'IS_UPDATE_DOWNLOADING';

const getNewAccountFromTemplate = ({ accountNumber, timestamp, publicKey, secretKey }: { accountNumber: number, timestamp: string, publicKey: string, secretKey: string }) => ({
  displayName: accountNumber > 0 ? `Account ${accountNumber}` : 'Main Account',
  created: timestamp,
  path: `0/0/${accountNumber}`,
  publicKey,
  secretKey
});

export const setWalletMeta = ({ meta }: { meta: WalletMeta }): Action => ({ type: SET_WALLET_META, payload: { meta } });

export const setAccounts = ({ accounts }: { accounts: Account[] }): Action => ({ type: SET_ACCOUNTS, payload: { accounts } });

export const setCurrentAccount = ({ index }: { index: number }): Action => ({ type: SET_CURRENT_ACCOUNT_INDEX, payload: { index } });

export const setMnemonic = ({ mnemonic }: { mnemonic: string }): Action => ({ type: SET_MNEMONIC, payload: { mnemonic } });

export const setTransactions = ({ transactions }: { transactions: AccountTxs }): Action => ({ type: SET_TRANSACTIONS, payload: { transactions } });

export const setContacts = ({ contacts }: { contacts: Contact[] }): Action => ({ type: SET_CONTACTS, payload: { contacts } });

export const createNewWallet = ({ mnemonic, password }: { mnemonic?: string, password: string }): Action => async (dispatch: Dispatch): Dispatch => {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const resolvedMnemonic = mnemonic || cryptoService.generateMnemonic();
  const { publicKey, secretKey } = cryptoService.generateKeyPair({ mnemonic: resolvedMnemonic });
  const dataToEncrypt = {
    mnemonic: resolvedMnemonic,
    accounts: [getNewAccountFromTemplate({ accountNumber: 0, timestamp, publicKey, secretKey })]
  };
  try {
    const { meta } = await eventsService.createWallet({ timestamp, dataToEncrypt, password });
    dispatch(setWalletMeta({ meta }));
    dispatch(setAccounts({ accounts: dataToEncrypt.accounts }));
    dispatch(setMnemonic({ mnemonic: resolvedMnemonic }));
    localStorageService.set('accountNumber', 1);
    dispatch(readWalletFiles());
  } catch (err) {
    throw createError('Error creating new wallet!', () => dispatch(createNewWallet({ mnemonic, password })));
  }
};

export const readWalletFiles = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const { files } = await eventsService.readWalletFiles();
    dispatch({ type: SAVE_WALLET_FILES, payload: { files } });
    return files;
  } catch (err) {
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: [] } });
    return [];
  }
};

export const unlockWallet = ({ password }: { password: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { walletFiles } = getState().wallet;
    const response = await eventsService.unlockWallet({ path: walletFiles[0], password });
    const { accounts, mnemonic, meta, contacts } = response;
    dispatch(setWalletMeta({ meta }));
    dispatch(setAccounts({ accounts }));
    dispatch(setMnemonic({ mnemonic }));
    dispatch(setContacts({ contacts }));
    dispatch(setCurrentAccount({ index: 0 }));
  } catch (err) {
    throw createError(err.message, () => dispatch(unlockWallet({ password })));
  }
};

export const updateWalletName = ({ displayName }: { displayName: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { walletFiles, meta } = getState().wallet;
  const updatedMeta = { ...meta, displayName };
  await eventsService.updateWalletFile({ fileName: walletFiles[0], data: { meta } });
  dispatch(setWalletMeta({ meta: updatedMeta }));
};

export const createNewAccount = ({ password }: { password: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { walletFiles, mnemonic, accounts } = getState().wallet;
  const { publicKey, secretKey } = cryptoService.deriveNewKeyPair({ mnemonic, index: accounts.length });
  const timestamp = new Date().toISOString().replace(/:/, '-');
  const accountNumber = localStorageService.get('accountNumber');
  const newAccount = getNewAccountFromTemplate({ accountNumber, timestamp, publicKey, secretKey });
  const updatedAccounts = [...accounts, newAccount];
  await eventsService.updateWalletFile({ fileName: walletFiles[0], password, data: { mnemonic, accounts: updatedAccounts } });
  dispatch(setAccounts({ accounts: updatedAccounts }));
  localStorageService.set('accountNumber', accountNumber + 1);
};

export const updateAccountName = ({ accountIndex, name, password }: { accountIndex: number, name: string, password: string }): Action => async (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
  const { walletFiles, accounts, mnemonic } = getState().wallet;
  const updatedAccount = { ...accounts[accountIndex], displayName: name };
  const updatedAccounts = [...accounts.slice(0, accountIndex), updatedAccount, ...accounts.slice(accountIndex + 1)];
  await eventsService.updateWalletFile({ fileName: walletFiles[0], password, data: { mnemonic, accounts: updatedAccounts } });
  dispatch(setAccounts({ accounts: updatedAccounts }));
};

export const addToContacts = ({ contact }: Contact): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { contacts } = getState().wallet;
  const updatedContacts = [contact, ...contacts];
  dispatch(setContacts({ contacts: updatedContacts })); // TODO: update the wallet file and rescan transactions
};

export const restoreFile = ({ filePath }: { filePath: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { walletFiles } = getState().wallet;
  const { newFilePath } = await eventsService.copyFile({ filePath });
  dispatch({ type: SAVE_WALLET_FILES, payload: { files: walletFiles ? [newFilePath, ...walletFiles] : [newFilePath] } });
};

export const backupWallet = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { walletFiles } = getState().wallet;
    await eventsService.copyFile({ filePath: walletFiles[0], copyToDocuments: true });
    localStorageService.set('hasBackup', true);
    localStorageService.set('lastBackupTime', new Date());
  } catch (error) {
    throw createError('Error creating wallet backup!', () => dispatch(backupWallet()));
  }
};

export const setUpdateDownloading = ({ isUpdateDownloading }: { isUpdateDownloading: boolean }): Action => ({ type: SET_UPDATE_DOWNLOADING, payload: { isUpdateDownloading } });

export const getBalance = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { accounts, currentAccountIndex } = getState().wallet;
    const { balance } = await eventsService.getBalance({ address: accounts[currentAccountIndex].publicKey });
    dispatch({ type: SET_BALANCE, payload: { balance } });
  } catch (error) {
    console.log(error); // eslint-disable-line no-console
  }
};

export const sendTransaction = ({ recipient, amount, fee, note }: { recipient: string, amount: number, fee: number, note: string }): Action => async (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
  try {
    const { accounts, currentAccountIndex } = getState().wallet;
    const accountNonce = await eventsService.getNonce({ address: accounts[currentAccountIndex].publicKey });
    const { tx } = await cryptoService.signTransaction({
      accountNonce,
      recipient,
      price: fee,
      amount,
      secretKey: accounts[currentAccountIndex].secretKey
    });
    const txToAdd = {
      sender: getAddress(accounts[currentAccountIndex].publicKey),
      receiver: recipient,
      amount,
      fee,
      status: TX_STATUSES.PENDING,
      timestamp: new Date().getTime(),
      note
    };
    const { transactions, id } = await eventsService.sendTx({ tx, accountIndex: currentAccountIndex, txToAdd });
    dispatch(setTransactions({ transactions }));
    return id;
  } catch (error) {
    throw createError('Error sending transaction!', () => dispatch(sendTransaction({ recipient, amount, fee, note })));
  }
};

export const updateTransaction = ({ newData, txId }: { newData: string, txId?: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { currentAccountIndex } = getState().wallet;
  const { transactions } = await eventsService.updateTransaction({ newData, accountIndex: currentAccountIndex, txId });
  dispatch(setTransactions({ transactions }));
};

export const getTxList = ({ approveTxNotifier }: { approveTxNotifier: Function }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { currentAccountIndex } = getState().wallet;
  const { transactions, hasConfirmedIncomingTxs, hasConfirmedOutgoingTxs } = await eventsService.getAccountTxs({ accountIndex: currentAccountIndex });
  if (hasConfirmedIncomingTxs || hasConfirmedOutgoingTxs) {
    approveTxNotifier({ hasConfirmedIncomingTxs });
  }
  dispatch(setTransactions({ transactions }));
};
