// @flow
import { combineReducers } from 'redux';
import auth from './auth/reducer';
import wallet from './wallet/reducer';
import localNode from './localNode/reducer';

export default function createRootReducer(): any {
  return combineReducers({
    auth,
    wallet,
    localNode
  });
}
