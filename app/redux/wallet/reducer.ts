import { WalletMeta } from '../../../shared/types';
import type { WalletState, CustomAction } from '../../types';
import { LOGOUT } from '../auth/actions';
import { IPC_BATCH_SYNC, reduceChunkUpdate } from '../ipcBatchSync';
import { ADD_ACCOUNT_REWARD, SET_ACCOUNT_REWARDS } from '../smesher/actions';
import {
  SAVE_WALLET_FILES,
  SET_TRANSACTIONS,
  SET_CURRENT_ACCOUNT_INDEX,
  SET_BACKUP_TIME,
  SET_CURRENT_MODE,
  SET_REMOTE_API,
  UPDATE_ACCOUNT_DATA,
  ADD_TRANSACTION,
} from './actions';

const initialState = {
  // Data comes from rx state
  walletFiles: [],
  currentWalletPath: null,
  meta: {} as WalletMeta,
  mnemonic: '',
  accounts: [],
  keychain: [],
  // Data comes from legacy sources
  currentAccountIndex: 0,
  transactions: {},
  rewards: {},
  lastUsedContacts: [],
  contacts: [],
  backupTime: '',
  vaultMode: 0,
  balances: {},
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
      return { ...state, walletFiles: action.payload };
    }
    case SET_REMOTE_API: {
      return {
        ...state,
        genesisID: action.payload.genesisID,
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
      return {
        ...state,
        balances: {
          ...state.balances,
          [accountId]: {
            ...state.balances[accountId],
            currentState: account.currentState,
            projectedState: account.projectedState,
          },
        },
      };
    }
    case ADD_TRANSACTION: {
      const { address, tx } = action.payload;
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [address]: {
            ...state.transactions[address],
            [tx.id]: tx,
          },
        },
      };
    }
    case SET_TRANSACTIONS: {
      const { publicKey, txs } = action.payload;
      return {
        ...state,
        transactions: { ...state.transactions, [publicKey]: txs },
      };
    }
    case ADD_ACCOUNT_REWARD: {
      const { reward, address } = action.payload;
      return {
        ...state,
        rewards: {
          ...state.rewards,
          [address]: [...(state.rewards[address] ?? []), reward],
        },
      };
    }
    case SET_ACCOUNT_REWARDS: {
      const { rewards, publicKey } = action.payload;
      return { ...state, rewards: { ...state.rewards, [publicKey]: rewards } };
    }
    case SET_BACKUP_TIME: {
      const { backupTime } = action.payload;
      return { ...state, backupTime };
    }
    case LOGOUT: {
      return initialState;
    }
    case IPC_BATCH_SYNC: {
      return reduceChunkUpdate('wallet', action.payload, state);
    }
    default:
      return state;
  }
};

export default reducer;
