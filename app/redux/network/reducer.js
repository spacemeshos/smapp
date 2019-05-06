// @flow
import type { Action } from '/types';
import { CHECK_NETWORK_CONNECTION } from './actions';

const initialState = {
  isConnected: true
};

const reducer = (state: any = initialState, action: Action) => {
  switch (action.type) {
    case CHECK_NETWORK_CONNECTION: {
      const {
        payload: { isConnected }
      } = action;
      return { ...state, isConnected };
    }
    default:
      return state;
  }
};

export default reducer;
