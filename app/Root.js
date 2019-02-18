// @flow
import React from 'react';
import { Provider } from 'react-redux';
import type { Store } from './redux/types';
import App from './App';

const Root = ({ store } : { store: Store }) => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Root;
