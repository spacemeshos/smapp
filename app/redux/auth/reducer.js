// @flow
import type { Action } from '../types';
import { SET_AUTHENTICATED } from './actions';

const initialState = {};

const reducer = (state: Object = initialState, action: Action) => {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
