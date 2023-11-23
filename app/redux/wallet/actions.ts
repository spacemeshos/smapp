import {
  Contact,
  HexString,
  SocketAddress,
  Tx,
  TxSendRequest,
  WalletMeta,
  WalletType,
  Account,
  MnemonicOpts,
  Bech32Address,
} from '../../../shared/types';
import {
  delay,
  isLocalNodeApi,
  isRemoteNodeApi,
  isWalletOnlyType,
  stringifySocketAddress,
} from '../../../shared/utils';
import { eventsService } from '../../infra/eventsService';
import { addErrorPrefix } from '../../infra/utils';
import { AppThDispatch, GetState } from '../../types';
import { logout } from '../auth/actions';
import { getGenesisID } from '../network/selectors';
import { setUiError } from '../ui/actions';

export const SET_WALLET_META = 'SET_WALLET_META';
export const SET_ACCOUNTS = 'SET_ACCOUNTS';
export const SET_CURRENT_ACCOUNT_INDEX = 'SET_CURRENT_ACCOUNT_INDEX';
export const SET_CURRENT_MODE = 'SET_CURRENT_MODE';

export const SET_REMOTE_API = 'SET_REMOTE_API';
export const SET_MNEMONIC = 'SET_MNEMONIC';
export const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const SET_CONTACTS = 'SET_CONTACTS';

export const UPDATE_ACCOUNT_DATA = 'UPDATE_ACCOUNT_DATA';

export const SAVE_WALLET_FILES = 'SAVE_WALLET_FILES';

export const SET_BACKUP_TIME = 'SET_BACKUP_TIME';

const waitForWalletData = async (getState: GetState) => {
  return (
    getState().wallet.accounts.length > 0 ||
    delay(100).then(() => waitForWalletData(getState))
  );
};

export const setWalletMeta = (wallet: WalletMeta) => ({
  type: SET_WALLET_META,
  payload: wallet,
});

export const setAccounts = (accounts: Account[]) => ({
  type: SET_ACCOUNTS,
  payload: accounts,
});

export const setCurrentAccount = (index: number) => ({
  type: SET_CURRENT_ACCOUNT_INDEX,
  payload: index,
});

export const setMnemonic = (mnemonic: string) => ({
  type: SET_MNEMONIC,
  payload: mnemonic,
});

export const updateAccountData = ({
  account,
  accountId,
}: {
  account: any;
  accountId: string;
}) => ({ type: UPDATE_ACCOUNT_DATA, payload: { account, accountId } });

export const addTransaction = (address: Bech32Address, tx: Tx<any>) => ({
  type: ADD_TRANSACTION,
  payload: { address, tx },
});

export const setTransactions = ({
  txs,
  publicKey,
}: {
  txs: Record<HexString, Tx>;
  publicKey: string;
}) => ({ type: SET_TRANSACTIONS, payload: { txs, publicKey } });

export const setContacts = (contacts: Contact[]) => ({
  type: SET_CONTACTS,
  payload: contacts,
});

export const setCurrentMode = (mode: number) => ({
  type: SET_CURRENT_MODE,
  payload: mode,
});

export const readWalletFiles = () => async (dispatch: AppThDispatch) => {
  const { error, payload } = await eventsService.readWalletFiles();
  if (error) {
    console.log(error); // eslint-disable-line no-console
    dispatch({ type: SAVE_WALLET_FILES, payload: [] });
    return [];
  }
  dispatch({ type: SAVE_WALLET_FILES, payload });
  return payload;
};

export const createNewWallet = ({
  mnemonic,
  password,
  apiUrl,
  genesisID,
  type,
  name,
}: {
  password: string;
  type: WalletType;
  apiUrl: SocketAddress | null;
  genesisID: string;
  mnemonic: MnemonicOpts;
  name?: string;
}) => (dispatch: AppThDispatch, getState: GetState) =>
  eventsService
    .createWallet({
      mnemonic,
      password,
      type,
      apiUrl,
      genesisID,
      name,
    })
    .then(async ({ error, payload }) => {
      if (error) {
        throw error;
      }
      await waitForWalletData(getState);
      return payload;
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      dispatch(setUiError(addErrorPrefix('Can not create new wallet\n', err)));
    });

export const unlockWallet = (path: string, password: string) => async (
  dispatch: AppThDispatch,
  getState: GetState
) => {
  const resp = await eventsService.unlockWallet({
    path,
    password,
  });
  const { error, payload } = resp;
  if (error) {
    return { success: false };
  }
  dispatch(setCurrentAccount(0));
  const isWalletOnly = isWalletOnlyType(payload.meta.type);
  await waitForWalletData(getState);
  return {
    success: true,
    forceNetworkSelection: payload.forceNetworkSelection,
    isWalletOnly,
  };
};
export const unlockCurrentWallet = (password: string) => async (
  dispatch: AppThDispatch,
  getState: GetState
) => {
  const {
    wallet: { currentWalletPath },
  } = getState();
  if (!currentWalletPath) {
    return { success: false };
  }
  return dispatch(unlockWallet(currentWalletPath, password));
};

export const switchApiProvider = (
  api: SocketAddress,
  genesisID?: string
) => async (dispatch: AppThDispatch, getState: GetState) => {
  const nextGenesisID = genesisID || getGenesisID(getState());
  await eventsService.switchApiProvider(nextGenesisID, api);
  dispatch({
    type: SET_REMOTE_API,
    payload: {
      api: api && isRemoteNodeApi(api) ? stringifySocketAddress(api) : '',
      genesisID,
      type:
        api && isLocalNodeApi(api)
          ? WalletType.LocalNode
          : WalletType.RemoteApi,
    },
  });
  dispatch(logout());
  return true;
};

export const updateWalletName = ({
  displayName,
}: {
  displayName: string;
}) => async (dispatch: AppThDispatch, getState: GetState) => {
  const { wallet } = getState();
  const { meta } = wallet;
  const updatedMeta = { ...meta, displayName };

  eventsService.updateWalletMeta('displayName', displayName);
  dispatch(setWalletMeta(updatedMeta));
};

export const createNewAccount = ({ password }: { password: string }) => async (
  dispatch: AppThDispatch,
  getState: GetState
) => {
  const { accounts, currentWalletPath } = getState().wallet;
  if (!currentWalletPath) {
    dispatch(
      setUiError(
        new Error('Can not create new account: No currently opened wallet')
      )
    );
    return;
  }
  const { error, payload } = await eventsService.createNewAccount({
    path: currentWalletPath,
    password,
  });
  if (error) {
    console.log(error); // eslint-disable-line no-console
    dispatch(setUiError(addErrorPrefix('Can not create new account\n', error)));
  }
  if (payload) {
    dispatch(setAccounts([...accounts, payload] as Account[]));
  }
};

export const addToContacts = ({
  contact,
  password,
}: {
  contact: Contact;
  password: string;
}) => (_: AppThDispatch, getState: GetState) => {
  const { currentWalletPath } = getState().wallet;
  if (!currentWalletPath) return false;
  // TODO: Instead make such actions simple actions (without thunk)
  //       and call `eventsService` via middleware
  eventsService.addContact({
    path: currentWalletPath,
    password,
    contact,
  });
  return true;
};

export const removeFromContacts = ({
  contact,
  password,
}: {
  contact: Contact;
  password: string;
}) => (_: AppThDispatch, getState: GetState) => {
  const { currentWalletPath } = getState().wallet;
  if (!currentWalletPath) return false;
  // TODO: Instead make such actions simple actions (without thunk)
  //       and call `eventsService` via middleware
  eventsService.removeContact({
    path: currentWalletPath,
    password,
    contact,
  });
  return true;
};

export const restoreFile = ({ filePath }: { filePath: string }) => async (
  dispatch: AppThDispatch
) => {
  const { error } = await eventsService.addWalletPath(filePath);

  if (error) {
    const errorMessage = addErrorPrefix(
      'Cannot restore wallet file\n',
      new Error(error.message)
    );
    dispatch(setUiError(errorMessage));
    return false;
  }

  return true;
};

export const backupWallet = () => async (
  dispatch: AppThDispatch,
  getState: GetState
) => {
  const { currentWalletPath } = getState().wallet;
  if (!currentWalletPath) {
    dispatch(
      setUiError(
        new Error('Can not create wallet backup: Wallet does not opened')
      )
    );
    return null;
  }
  const { error, filePath } = await eventsService.backupWallet(
    currentWalletPath
  );
  if (error) {
    console.log(error); // eslint-disable-line no-console
    dispatch(
      setUiError(addErrorPrefix('Can not create wallet backup\n', error))
    );
    return null;
  } else {
    dispatch({ type: SET_BACKUP_TIME, payload: { backupTime: new Date() } });
    return filePath;
  }
};

export const sendTransaction = ({
  receiver,
  amount,
  fee,
  note,
}: {
  receiver: string;
  amount: number;
  fee: number;
  note: string;
}) => async (dispatch: AppThDispatch, getState: GetState) => {
  const { accounts, currentAccountIndex } = getState().wallet;
  const fullTx: TxSendRequest = {
    sender: accounts[currentAccountIndex].address,
    receiver,
    amount,
    fee,
    note,
  };
  const { error, tx } = await eventsService.sendTx({
    fullTx,
    accountIndex: currentAccountIndex,
  });
  if (tx) {
    return { id: tx.id };
  } else {
    const errorToLog = error
      ? addErrorPrefix('Send transaction error\n', error as Error)
      : new Error(
          'Send transaction error: unexpectedly got no Tx and no Error'
        );
    console.log(errorToLog); // eslint-disable-line no-console
    dispatch(setUiError(errorToLog));
    return {}; // TODO: Need a refactoring here
  }
};
