// @flow
import { combineReducers } from 'redux';
import wallet from './wallet/reducer';
import node from './node/reducer';

export default function createRootReducer(): any {
  return combineReducers({
    wallet,
    node
  });
}
