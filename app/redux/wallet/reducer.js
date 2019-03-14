// @flow
import type { Action } from '/types';
import { LOGOUT } from '/redux/auth/actions';

const initialState = {};

const reducer = (state: Object = initialState, action: Action) => {
  switch (action.type) {
    case LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
