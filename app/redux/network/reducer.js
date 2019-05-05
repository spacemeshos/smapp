// @flow
import type { Action } from '/types';
import { CHECK_NETWORK_CONNECTION } from './actions';

const initialState = {
  isNetworkConnected: true
};

const reducer = (state: any = initialState, action: Action) => {
  switch (action.type) {
    case CHECK_NETWORK_CONNECTION: {
      const {
        payload: { isNetworkConnected }
      } = action;
      return { ...state, isNetworkConnected };
    }
    default:
      return state;
  }
};

export default reducer;
