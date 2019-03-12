import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type storeStateType = {
  +wallet: any,
  +fullNode: any
};

export type Action = {
  +type: string,
  payload?: any
};

export type GetState = () => storeStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
