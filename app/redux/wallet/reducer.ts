import type { WalletState, CustomAction, Tx } from '../../types';
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
  UPDATE_ACCOUNT_DATA
} from './actions';

const initialState = {
  walletFiles: null,
  meta: {},
  mnemonic: '',
  accounts: [],
  currentAccountIndex: 0,
  transactions: {},
  txsAndRewards: {},
  lastUsedContacts: [],
  contacts: [],
  backupTime: '',
  vaultMode: 0
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
    case SAVE_WALLET_FILES: {
      const {
        payload: { files }
      } = action;
      return { ...state, walletFiles: files };
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
    case SET_CURRENT_ACCOUNT_INDEX: {
      const { index } = action.payload;
      if (index < state.accounts.length && index >= 0) {
        return { ...state, currentAccountIndex: index };
      }
      return state;
    }
    case SET_CURRENT_MODE: {
      const { mode } = action.payload;
      return { ...state, vaultMode: mode };
    }
    case UPDATE_ACCOUNT_DATA: {
      const { account, accountId } = action.payload;
      const accountIndexToUpdate = state.accounts.findIndex((account) => account.publicKey === accountId);
      return {
        ...state,
        accounts: [
          ...state.accounts.slice(0, accountIndexToUpdate),
          { ...state.accounts[accountIndexToUpdate], currentState: account.currentState, projectedState: account.projectedState },
          ...state.accounts.slice(accountIndexToUpdate + 1)
        ]
      };
    }
    case SET_TRANSACTIONS: {
      const { publicKey, txs } = action.payload;
      if (state.transactions[publicKey]) {
        const updatedTransactions = [...state.transactions[publicKey], ...txs].sort((tx1: Tx, tx2: Tx) => tx2.timestamp - tx1.timestamp);
        return { ...state, transactions: { ...state.transactions, [publicKey]: updatedTransactions } };
      }
      return { ...state, transactions: { ...state.transactions, [publicKey]: [...txs] } };
    }
    case SET_ACCOUNT_REWARDS: {
      const { rewards, publicKey } = action.payload;
      if (state.transactions[publicKey]) {
        const updatedTransactions = [...state.transactions[publicKey], ...rewards].sort((tx1: Tx, tx2: Tx) => tx2.timestamp - tx1.timestamp);
        return { ...state, txsAndRewards: { [publicKey]: updatedTransactions } };
      } else {
        return { ...state, txsAndRewards: { [publicKey]: [...rewards] } };
      }
    }
    case SET_CONTACTS: {
      const { contacts } = action.payload;
      return { ...state, contacts };
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
