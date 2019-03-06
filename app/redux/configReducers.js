// @flow
import { combineReducers } from 'redux';
import { auth, wallet } from './reducers';

export default function createRootReducer(): any {
  return combineReducers({
    auth,
    wallet
  });
}
