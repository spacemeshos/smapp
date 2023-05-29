import { createStore, applyMiddleware, compose, Store } from 'redux';
import thunk from 'redux-thunk';
// Utils
import { addErrorPrefix } from '../infra/utils';
import { CustomAction, RootState, AppThDispatch, GetState } from '../types';
import createErrorHandlerMiddleware from './errorHandlerMiddleware';
import IpcSyncRenderer from './ipcSync';
import { setUiError } from './ui/actions';
//
import rootReducer from './rootReducer';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const errorHandlerMiddleware = createErrorHandlerMiddleware((err: Error) => {
  const error = addErrorPrefix('Unhandled error in action:\n', err);
  // eslint-disable-next-line no-console
  console.error(error);
  return setUiError(error);
});

const store: Store<RootState, CustomAction> & {
  dispatch: AppThDispatch;
  getState: GetState;
} = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(errorHandlerMiddleware, thunk))
);

IpcSyncRenderer(store);

export default store;
