// @flow
import { combineReducers } from 'redux';
import auth from './auth/reducer';
import wallet from './wallet/reducer';
import localNode from './localNode/reducer';
import network from './network/reducer';
import errorHandler from './errorHandler/reducer';

export default function createRootReducer(): any {
  return combineReducers({
    auth,
    wallet,
    localNode,
    network,
    errorHandler
  });
}
