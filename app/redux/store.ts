import { createStore, applyMiddleware, compose, Store } from 'redux';
import thunk from 'redux-thunk';
import { CustomAction, RootState, AppThDispatch, GetState } from '../types';
import createRootReducer from './rootReducer';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const rootReducer = createRootReducer();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store: Store<RootState, CustomAction> & { dispatch: AppThDispatch; getState: GetState } = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
