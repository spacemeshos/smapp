// @flow
import { combineReducers } from 'redux';
import counter from './counter/reducer';

export default function createRootReducer(): any {
  return combineReducers({
    counter
  });
}
