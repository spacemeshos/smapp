// @flow
import { combineReducers } from 'redux';
import auth from './auth/reducer';
import wallet from './wallet/reducer';

export default function createRootReducer(): any {
  return combineReducers({
    auth,
    wallet
  });
}
