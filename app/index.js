import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import { configureStore } from './redux/configureStore';

const store = configureStore();

const renderWrapper = (Component) => {
  render(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    document.getElementById('root')
  );
};

renderWrapper(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./App').default;
    renderWrapper(NextApp);
  });
}
