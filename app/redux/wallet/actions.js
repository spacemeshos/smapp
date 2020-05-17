// @flow
import { eventsService } from '/infra/eventsService';
import { cryptoService } from '/infra/cryptoService';
import { createError, getAddress } from '/infra/utils';
import { Action, Dispatch, GetState, WalletMeta, Account, AccountTxs, Contact } from '/types';
import TX_STATUSES from '/vars/enums';

export const SET_WALLET_META: string = 'SET_WALLET_META';
export const SET_ACCOUNTS: string = 'SET_ACCOUNTS';
export const SET_CURRENT_ACCOUNT_INDEX: string = 'SET_CURRENT_ACCOUNT_INDEX';
export const SET_MNEMONIC: string = 'SET_MNEMONIC';
export const SET_TRANSACTIONS: string = 'SET_TRANSACTIONS';
export const SET_CONTACTS: string = 'SET_CONTACTS';

export const SAVE_WALLET_FILES = 'SAVE_WALLET_FILES';

export const SET_BALANCE: string = 'SET_BALANCE';

export const SET_BACKUP_TIME: string = 'SET_BACKUP_TIME';

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
  const { error, meta } = await eventsService.createWallet({ timestamp, dataToEncrypt, password });
  if (error) {
    console.log(error); // eslint-disable-line no-console
    throw createError('Error creating new wallet!', () => dispatch(createNewWallet({ mnemonic, password })));
  } else {
    dispatch(setWalletMeta({ meta }));
    dispatch(setAccounts({ accounts: dataToEncrypt.accounts }));
    dispatch(setMnemonic({ mnemonic: resolvedMnemonic }));
    localStorage.setItem('accountNumber', 1);
    dispatch(readWalletFiles());
  }
};

export const readWalletFiles = (): Action => async (dispatch: Dispatch): Dispatch => {
  const { error, files } = await eventsService.readWalletFiles();
  if (error) {
    console.log(error); // eslint-disable-line no-console
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: [] } });
    return [];
  }
  dispatch({ type: SAVE_WALLET_FILES, payload: { files } });
  return files;
};

export const unlockWallet = ({ password }: { password: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { walletFiles } = getState().wallet;
  const { error, accounts, mnemonic, meta, contacts } = await eventsService.unlockWallet({ path: walletFiles[0], password });
  if (error) {
    console.log(error); // eslint-disable-line no-console
    throw createError(error.message, () => dispatch(unlockWallet({ password })));
  } else {
    dispatch(setWalletMeta({ meta }));
    dispatch(setAccounts({ accounts }));
    dispatch(setMnemonic({ mnemonic }));
    dispatch(setContacts({ contacts }));
    dispatch(setCurrentAccount({ index: 0 }));
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
  const accountNumber = localStorage.getItem('accountNumber');
  const newAccount = getNewAccountFromTemplate({ accountNumber, timestamp, publicKey, secretKey });
  const updatedAccounts = [...accounts, newAccount];
  await eventsService.updateWalletFile({ fileName: walletFiles[0], password, data: { mnemonic, accounts: updatedAccounts } });
  dispatch(setAccounts({ accounts: updatedAccounts }));
  localStorage.setItem('accountNumber', accountNumber + 1);
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
  const { error, newFilePath } = await eventsService.copyFile({ filePath });
  if (error) {
    console.log(error); // eslint-disable-line no-console
    throw createError('Error restoring file!', () => dispatch(restoreFile({ filePath })));
  } else {
    dispatch({ type: SAVE_WALLET_FILES, payload: { files: walletFiles ? [newFilePath, ...walletFiles] : [newFilePath] } });
  }
};

export const backupWallet = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { walletFiles } = getState().wallet;
  const { error } = await eventsService.copyFile({ filePath: walletFiles[0], copyToDocuments: true });
  if (error) {
    console.log(error); // eslint-disable-line no-console
    throw createError('Error creating wallet backup!', () => dispatch(backupWallet()));
  } else {
    dispatch({ type: SET_BACKUP_TIME, payload: { backupTime: new Date() } });
  }
};

export const setUpdateDownloading = ({ isUpdateDownloading }: { isUpdateDownloading: boolean }): Action => ({ type: SET_UPDATE_DOWNLOADING, payload: { isUpdateDownloading } });

export const getBalance = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { accounts, currentAccountIndex } = getState().wallet;
  const { error, balance } = await eventsService.getBalance({ address: accounts[currentAccountIndex].publicKey });
  if (error) {
    console.log(error); // eslint-disable-line no-console
  } else {
    dispatch({ type: SET_BALANCE, payload: { balance } });
  }
};

export const sendTransaction = ({ recipient, amount, fee, note }: { recipient: string, amount: number, fee: number, note: string }): Action => async (
  dispatch: Dispatch,
  getState: GetState
): Dispatch => {
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
  const { error, transactions, id } = await eventsService.sendTx({ tx, accountIndex: currentAccountIndex, txToAdd });
  if (error) {
    console.log(error); // eslint-disable-line no-console
    throw createError('Error sending transaction!', () => dispatch(sendTransaction({ recipient, amount, fee, note })));
  } else {
    dispatch(setTransactions({ transactions }));
    return id;
  }
};

export const updateTransaction = ({ newData, txId }: { newData: string, txId?: string }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { currentAccountIndex } = getState().wallet;
  const { transactions } = await eventsService.updateTransaction({ newData, accountIndex: currentAccountIndex, txId });
  dispatch(setTransactions({ transactions }));
};

export const getTxList = ({ approveTxNotifier }: { approveTxNotifier: ({ hasConfirmedIncomingTxs: boolean }) => void }): Action => async (dispatch: Dispatch): Dispatch => {
  const { transactions, hasConfirmedIncomingTxs, hasConfirmedOutgoingTxs } = await eventsService.getAccountTxs();
  if (hasConfirmedIncomingTxs || hasConfirmedOutgoingTxs) {
    approveTxNotifier({ hasConfirmedIncomingTxs });
  }
  dispatch(setTransactions({ transactions }));
};
