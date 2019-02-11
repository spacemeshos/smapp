import { applyMiddleware, createStore, compose } from 'redux';
import configureDeps from './configureDeps';
import configureReducers from './configureReducers';
import configureMiddleware from './configureMiddleware';

const configureStore = ({ initialState }: { initialState: Object }) => {
  const reducer = configureReducers({ initialState });

  const deps = configureDeps({});

  const middleware = configureMiddleware({ initialState, deps });

  const enhancers = [applyMiddleware(...middleware)];

  if (global.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(global.__REDUX_DEVTOOLS_EXTENSION__());
  }

  // $FlowFixMe
  const store = createStore(reducer, initialState, compose(...enhancers));

  return store;
};

export default configureStore;
