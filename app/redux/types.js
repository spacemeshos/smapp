import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type counterStateType = {
  +counter: number
};

export type Action = {
  +type: string,
  payload?: any
};

export type GetState = () => counterStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
