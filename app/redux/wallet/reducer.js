// @flow
import type { Action, StoreStateType, TxList, Tx, Contact } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import {
  SAVE_WALLET_FILES,
  STORE_ENCRYPTION_KEY,
  SET_WALLET_META,
  SET_BALANCE,
  SET_ACCOUNTS,
  SET_MNEMONIC,
  SET_TRANSACTIONS,
  SET_CONTACTS,
  SET_CURRENT_ACCOUNT_INDEX,
  SET_UPDATE_DOWNLOADING
} from './actions';

const initialState = {
  fileKey: null,
  walletFiles: null,
  meta: {},
  mnemonic: null,
  accounts: [],
  currentAccountIndex: 0,
  transactions: {},
  lastUsedContacts: [],
  contacts: [],
  fiatRate: 1,
  isUpdateDownloading: false
};

const getFirst3UniqueAddresses = (txList: TxList): Contact[] => {
  const unique = new Set();
  for (let i = 0; i < txList.length && i < 3; i += 1) {
    if (!unique.has(txList[i])) {
      unique.add(txList[i]);
    }
  }
  return Array.from(unique).map((uniqueTx: Tx) => ({ address: uniqueTx.address, nickname: uniqueTx.nickname || '' }));
};

const reducer = (state: StoreStateType = initialState, action: Action) => {
  switch (action.type) {
    case SAVE_WALLET_FILES: {
      const {
        payload: { files }
      } = action;
      return { ...state, walletFiles: files };
    }
    case STORE_ENCRYPTION_KEY: {
      const {
        payload: { key }
      } = action;
      return { ...state, fileKey: key };
    }
    case SET_WALLET_META: {
      const {
        payload: { meta }
      } = action;
      return { ...state, meta };
    }
    case SET_ACCOUNTS: {
      const {
        payload: { accounts }
      } = action;
      return { ...state, accounts };
    }
    case SET_MNEMONIC: {
      const { mnemonic } = action.payload;
      return { ...state, mnemonic };
    }
    case SET_TRANSACTIONS: {
      const { transactions } = action.payload;
      return {
        ...state,
        transactions,
        lastUsedContacts: transactions[state.currentAccountIndex].data.length ? getFirst3UniqueAddresses(transactions[state.currentAccountIndex].data) : []
      };
    }
    case SET_CURRENT_ACCOUNT_INDEX: {
      const { index } = action.payload;
      if (index < state.accounts.length && index >= 0) {
        return { ...state, currentAccountIndex: index };
      }
      return state;
    }
    case SET_BALANCE: {
      const { balance } = action.payload;
      const accountToUpdate = state.accounts[state.currentAccountIndex];
      accountToUpdate.balance = balance;
      return {
        ...state,
        accounts: [...state.accounts.slice(0, state.currentAccountIndex), accountToUpdate, ...state.accounts.slice(state.currentAccountIndex + 1)]
      };
    }
    case SET_CONTACTS: {
      const { contacts } = action.payload;
      return { ...state, contacts };
    }
    case SET_UPDATE_DOWNLOADING: {
      const { isUpdateDownloading } = action.payload;
      return { ...state, isUpdateDownloading };
    }
    case LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
