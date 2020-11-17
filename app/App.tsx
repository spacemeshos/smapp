import React from 'react';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import { Store } from './redux/store';
import StyledApp from './StyledApp';

type Props = {
  store: Store;
};

const App = ({ store }: Props) => (
  <Provider store={store}>
    <StyledApp />
  </Provider>
);

export default hot(App);
