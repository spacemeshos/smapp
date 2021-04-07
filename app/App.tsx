import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import StyledApp from './StyledApp';
import './assets/fonts/SourceCodePro-Regular.ttf';
import './assets/fonts/SourceCodePro-Bold.ttf';

const App = () => (
  <Provider store={store}>
    <StyledApp />
  </Provider>
);

export default App;
