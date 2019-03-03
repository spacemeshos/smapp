// @flow
import React from 'react';
import { Provider } from 'react-redux';
import type { Store } from './redux/types';
import App from './App';
import GlobalStyle from './globalStyle';

const Root = ({ store }: { store: Store }) => (
  <React.Fragment>
    <GlobalStyle />
    <Provider store={store}>
      <App />
    </Provider>
  </React.Fragment>
);

export default Root;
