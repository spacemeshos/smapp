// @flow
import type { Action, StoreStateType } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import { SAVE_WALLET_FILES, DERIVE_ENCRYPTION_KEY, INCREMENT_WALLET_NUMBER, INCREMENT_ACCOUNT_NUMBER, UPDATE_WALLET_DATA, GET_BALANCE, GET_FIAT_RATE } from './actions';

const initialState = {
  walletNumber: 0,
  accountNumber: 0,
  fileKey: null,
  walletFiles: null,
  wallet: {},
  transactions: [], // TODO: clear on switching account
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
    case UPDATE_WALLET_DATA: {
      const { payload } = action;
      return { ...state, wallet: payload };
    }
    case GET_BALANCE: {
      const { balance, accountIndex } = action.payload;
      const accountToUpdate = state.wallet.crypto.cipherText.accounts[accountIndex];
      accountToUpdate.balance = balance;
      return {
        ...state,
        wallet: {
          ...state.wallet,
          crypto: {
            ...state.wallet.crypto,
            cipherText: {
              ...state.wallet.crypto.cipherText,
              accounts: [...state.wallet.crypto.cipherText.accounts.slice(0, accountIndex), accountToUpdate, ...state.wallet.crypto.cipherText.accounts.slice(accountIndex + 1)]
            }
          }
        }
      };
    }
    case GET_FIAT_RATE: {
      // TODO: need to get actual fiat rate
      return { ...state, fiatRate: initialState.fiatRate };
    }
    case LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
