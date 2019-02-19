// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createRootReducer from './configReducers';
import type { counterStateType } from './types';

const rootReducer = createRootReducer();
const enhancer = applyMiddleware(thunk);

function configureStore(initialState?: counterStateType): any {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore };
