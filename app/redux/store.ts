import { createStore, applyMiddleware, compose, Store } from 'redux';
import thunk from 'redux-thunk';
import { addErrorPrefix } from '../infra/utils';
import { CustomAction, RootState, AppThDispatch, GetState } from '../types';
import createErrorHandlerMiddleware from './errorHandlerMiddleware';
import createRootReducer from './rootReducer';
import { setUiError } from './ui/actions';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const rootReducer = createRootReducer();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const errorHandlerMiddleware = createErrorHandlerMiddleware((err: Error) => {
  const error = addErrorPrefix('Unhandled error in action:\n', err);
  // eslint-disable-next-line no-console
  console.error(error);
  return setUiError(error);
});

const store: Store<RootState, CustomAction> & { dispatch: AppThDispatch; getState: GetState } = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(errorHandlerMiddleware, thunk))
);

export default store;
