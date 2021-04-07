import { createStore, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';
import { CustomAction, RootState, AppThDispatch, GetState } from '../types';
import createRootReducer from './rootReducer';

const rootReducer = createRootReducer();

const store: Store<RootState, CustomAction> & { dispatch: AppThDispatch; getState: GetState } = createStore(rootReducer, applyMiddleware(thunk));

export default store;
