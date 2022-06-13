import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import StyledApp from './StyledApp';

const App = () => (
  <Provider store={store}>
    <StyledApp />
  </Provider>
);

export default App;
