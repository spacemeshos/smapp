import React from 'react';
import { Provider } from 'react-redux';
import sentry, { captureException } from '../sentry/renderer';
import store from './redux/store';
import StyledApp from './StyledApp';

sentry();

try {
  const result = captureException(new Error('React error'));
  console.log({ result });
} catch (e) {
  console.log({ e });
}
const App = () => (
  <Provider store={store}>
    <StyledApp />
  </Provider>
);

export default App;
