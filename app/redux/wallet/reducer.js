// @flow
import type { Action } from '../types';
import { SET_LOGOUT } from './actions';

export default function reducer(state: any = {}, action: Action) {
  switch (action.type) {
    case SET_LOGOUT:
      return { ...state, wallet: null };
    default:
      return state;
  }
}
