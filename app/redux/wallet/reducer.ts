import * as R from 'ramda';
import { WalletMeta } from '../../../shared/types';
import type { WalletState, CustomAction } from '../../types';
import { LOGOUT } from '../auth/actions';
import { SET_ACCOUNT_REWARDS } from '../smesher/actions';
import {
  SAVE_WALLET_FILES,
  SET_WALLET_META,
  SET_ACCOUNTS,
  SET_MNEMONIC,
  SET_TRANSACTIONS,
  SET_CONTACTS,
  SET_CURRENT_ACCOUNT_INDEX,
  SET_BACKUP_TIME,
  SET_CURRENT_MODE,
  SET_REMOTE_API,
  UPDATE_ACCOUNT_DATA,
  SET_CURRENT_WALLET_PATH,
} from './actions';

const initialState = {
  walletFiles: [],
  currentWalletPath: null,
  meta: {} as WalletMeta,
  mnemonic: '',
  accounts: [],
  currentAccountIndex: 0,
  transactions: {},
  rewards: {},
  lastUsedContacts: [],
  contacts: [],
  backupTime: '',
  vaultMode: 0,
};

// TODO: fix this while fixing contacts feature
// const getFirst3UniqueAddresses = (txList: Tx[], ownAddress): Contact[] => {
//   const unique = new Set();
//   for (let i = 0; i < txList.length && i < 10; i += 1) {
//     if (!unique.has(txList[i]) && txList[i].receiver !== ownAddress) {
//       unique.add(txList[i]);
//     }
//   }
//   return Array.from(unique).map((uniqueTx: Tx) => ({ address: uniqueTx.receiver, nickname: uniqueTx.nickname || '' }));
// };

const reducer = (state: WalletState = initialState, action: CustomAction) => {
  switch (action.type) {
    case SET_CURRENT_WALLET_PATH: {
      return { ...state, currentWalletPath: action.payload };
    }
    case SAVE_WALLET_FILES: {
      return { ...state, walletFiles: action.payload };
    }
    case SET_WALLET_META: {
      return { ...state, meta: action.payload };
    }
    case SET_ACCOUNTS: {
      return { ...state, accounts: action.payload };
    }
    case SET_MNEMONIC: {
      return { ...state, mnemonic: action.payload };
    }
    case SET_REMOTE_API: {
      return {
        ...state,
        meta: {
          ...state.meta,
          remoteApi: action.payload.api,
          type: action.payload.type,
        },
      };
    }
    case SET_CURRENT_ACCOUNT_INDEX: {
      const index = action.payload;
      if (index < state.accounts.length && index >= 0) {
        return { ...state, currentAccountIndex: index };
      }
      return state;
    }
    case SET_CURRENT_MODE: {
      return { ...state, vaultMode: action.payload };
    }
    case UPDATE_ACCOUNT_DATA: {
      const { account, accountId } = action.payload;
      const accountIndexToUpdate = state.accounts.findIndex(
        (account) => account.publicKey === accountId
      );
      return {
        ...state,
        accounts: R.over(
          R.lensIndex(accountIndexToUpdate),
          (acc) => ({
            ...acc,
            currentState: account.currentState,
            projectedState: account.projectedState,
          }),
          state.accounts
        ),
      };
    }
    case SET_TRANSACTIONS: {
      const { publicKey, txs } = action.payload;
      return {
        ...state,
        transactions: { ...state.transactions, [publicKey]: txs },
      };
    }
    case SET_ACCOUNT_REWARDS: {
      const { rewards, publicKey } = action.payload;
      return { ...state, rewards: { [publicKey]: rewards } };
    }
    case SET_CONTACTS: {
      return { ...state, contacts: action.payload };
    }
    case SET_BACKUP_TIME: {
      const { backupTime } = action.payload;
      return { ...state, backupTime };
    }
    case LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
