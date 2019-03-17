// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import type { StoreStateType } from '/types';
import createRootReducer from './configReducers';

const rootReducer = createRootReducer();
const enhancer = applyMiddleware(thunk);

function configureStore(initialState?: StoreStateType): any {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore };
