// @flow
import type { Action } from '../types';
import { SET_AUTHENTICATED, LOGOUT } from './actions';

const initialState = {};

const reducer = (state: Object = initialState, action: Action) => {
  switch (action.type) {
    case SET_AUTHENTICATED: {
      return { ...state, ...action.payload };
    }
    case LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
};

export default reducer;
