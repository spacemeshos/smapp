// @flow
import type { Action, StoreStateType } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import {
  SAVE_WALLET_FILES,
  DERIVE_ENCRYPTION_KEY,
  INCREMENT_WALLET_NUMBER,
  INCREMENT_ACCOUNT_NUMBER,
  SET_WALLET_META,
  GET_BALANCE,
  SET_ACCOUNTS,
  SET_MNEMONIC,
  SET_TRANSACTIONS,
  SET_CONTACTS,
  ADD_LAST_USED_ADDRESS,
  SET_CURRENT_ACCOUNT_INDEX
} from './actions';

const initialState = {
  walletNumber: 0,
  accountNumber: 0,
  fileKey: null,
  walletFiles: null,
  meta: {},
  mnemonic: null,
  accounts: [],
  currentAccountIndex: 0,
  transactions: {},
  contacts: [],
  lastUsedAddresses: [
    // TODO: remove after sending transaction is fully functional
    {
      nickname: 'Frank Sinatra',
      address: 'dkwhkjhfhekk3876582909876ehgh7yfbhuy7y74hyu7fhhhhhfghjkjhgfghjk8',
      email: 'testemail@testing.com'
    },
    {
      nickname: null,
      address: 'sdadadasdadeqrf3456t543sdfghgfdsdfgh7654rfgvbhtresdxfgytredcvgyu'
    },
    {
      nickname: 'Etta James',
      address: '111223344554323sfxddfdghjksmnbvbnmsnbvbnsmsdhgjbmmdsds9993fdsocc'
    }
  ],
  fiatRate: 1
};

const reducer = (state: StoreStateType = initialState, action: Action) => {
  switch (action.type) {
    case SAVE_WALLET_FILES: {
      const {
        payload: { files }
      } = action;
      return { ...state, walletFiles: files };
    }
    case DERIVE_ENCRYPTION_KEY: {
      const {
        payload: { key }
      } = action;
      return { ...state, fileKey: key };
    }
    case INCREMENT_WALLET_NUMBER: {
      return { ...state, walletNumber: state.walletNumber + 1 };
    }
    case INCREMENT_ACCOUNT_NUMBER: {
      return { ...state, accountNumber: state.accountNumber + 1 };
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
      return { ...state, transactions };
    }
    case SET_CURRENT_ACCOUNT_INDEX: {
      const { index } = action.payload;
      if (index < state.accounts.length && index >= 0) {
        return { ...state, currentAccountIndex: index };
      }
      return state;
    }
    case GET_BALANCE: {
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
    case ADD_LAST_USED_ADDRESS: {
      const { contact } = action.payload;
      const { address } = contact;
      const updatedIndex = state.lastUsedAddresses.findIndex((lastUsedAddress) => lastUsedAddress.address === address);
      let updatedLastUsedAddresses;
      if (updatedIndex < 0) {
        updatedLastUsedAddresses = [contact, ...state.lastUsedAddresses];
      } else {
        updatedLastUsedAddresses = [contact, ...state.lastUsedAddresses.slice(0, updatedIndex), ...state.lastUsedAddresses.slice(updatedIndex + 1)];
      }
      return { ...state, lastUsedAddresses: updatedLastUsedAddresses.slice(0, 3) };
    }
    case LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
