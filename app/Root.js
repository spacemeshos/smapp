// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import type { Store } from './redux/types';
import App from './App';

type Props = {
  store: Store
};

export default class Root extends Component<Props> {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
