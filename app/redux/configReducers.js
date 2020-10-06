// @flow
import { combineReducers } from 'redux';
import wallet from './wallet/reducer';
import node from './node/reducer';
import smesher from './smesher/reducer';

export default function createRootReducer(): any {
  return combineReducers({
    wallet,
    node,
    smesher
  });
}
