import { combineReducers } from 'redux';
import network from './network/reducer';
import wallet from './wallet/reducer';
import node from './node/reducer';
import ui from './ui/reducer';
import smesher from './smesher/reducer';

export default function createRootReducer() {
  return combineReducers({
    network,
    wallet,
    node,
    ui,
    smesher
  });
}
