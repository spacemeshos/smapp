// @flow
import { combineReducers } from 'redux';
import counter from './counter/reducer';

export default function createRootReducer() {
  return combineReducers({
    counter
  });
}
