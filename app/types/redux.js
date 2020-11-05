import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';
import type { Wallet, Account } from './wallet';

export type StoreStateType = {
  +node: any,
  +wallet: {
    walletNumber: number,
    accountNumber: number,
    salt: string,
    wallet: Wallet,
    accounts: Account[],
    transactions: []
  },
  +ui: {
    isDarkMode: boolean
  }
};

export type Action = {
  +type: string,
  payload?: Object
};

export type GetState = () => StoreStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
