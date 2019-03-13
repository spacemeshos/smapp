import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type StoreStateType = {
  +wallet: any
};

export type Action = {
  +type: string,
  payload?: Object
};

export type GetState = () => StoreStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
