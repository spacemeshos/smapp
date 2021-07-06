import { createStore, applyMiddleware, compose, Store } from 'redux';
import thunk from 'redux-thunk';
import { CustomAction, RootState, AppThDispatch, GetState } from '../types';
import createRootReducer from './rootReducer';

const rootReducer = createRootReducer();

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store: Store<RootState, CustomAction> & { dispatch: AppThDispatch; getState: GetState } = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
