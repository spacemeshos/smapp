import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { RootState } from '../types';
import createRootReducer from './rootReducer';
import * as authActions from './auth/actions';
import * as walletActions from './wallet/actions';
import * as nodeActions from './node/actions';
import * as uiActions from './ui/actions';

const rootReducer = createRootReducer();

function configureMiddleware() {
  if (process.env.NODE_ENV === 'production') {
    return applyMiddleware(thunk);
  } else {
    // Redux Configuration
    const middleware = [];
    const enhancers = [];

    // Thunk Middleware
    middleware.push(thunk);

    // Redux DevTools Configuration
    const actionCreators = {
      ...authActions,
      ...walletActions,
      ...nodeActions,
      ...uiActions
    };
    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Options: http://extension.remotedev.io/docs/API/Arguments.html
          actionCreators
        })
      : compose;

    // Apply Middleware & Compose Enhancers
    enhancers.push(applyMiddleware(...middleware));
    return composeEnhancers(...enhancers);
  }
}

export const configuredStore = (initialState?: RootState) => {
  // Create Store
  const store = createStore(rootReducer, initialState, configureMiddleware());

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept(
      './rootReducer',
      // eslint-disable-next-line global-require
      () => store.replaceReducer(require('./rootReducer').default)
    );
  }
  return store;
};

// export type DispatchHook = DispatchProp<authActions && walletActions && nodeActions >
export type Store = ReturnType<typeof configuredStore>;
