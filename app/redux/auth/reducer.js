// @flow
import type { StoreStateType, Action } from '/types';
import { LOGOUT } from './actions';

const initialState = {};

const reducer = (state: StoreStateType = initialState, action: Action) => {
  switch (action.type) {
    case LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
