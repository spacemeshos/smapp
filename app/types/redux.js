import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';
import type { Wallet, Account } from './wallet';

export type StoreStateType = {
<<<<<<< HEAD
  +wallet: any,
  +localNode: any
=======
  +localNode: any,
  +wallet: {
    walletNumber: number,
    accountNumber: number,
    fileKey?: Buffer | null,
    salt: string,
    wallet: Wallet,
    accounts: Account[],
    transactions: []
  }
>>>>>>> 29398d2fa71d3d63d297fa9e921495f9bb4ebe51
};

export type Action = {
  +type: string,
  payload?: Object
};

export type GetState = () => StoreStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
