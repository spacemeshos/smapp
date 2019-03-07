// @flow
import type { Action } from '../types';
import { SET_AUTHENTICATED } from './actions';

export default function reducer(state: any = {}, action: Action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
