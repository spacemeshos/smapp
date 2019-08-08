import { hot, setConfig } from 'react-hot-loader';
import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { configureStore } from './redux/configureStore';

const configOptions: $Shape<Object> = {
  showReactDomPatchNotification: false
};

setConfig(configOptions);

const store = configureStore();

const renderWrapper = (Component) => {
  render(<Component store={store} />, document.getElementById('root'));
};

renderWrapper(process.env.NODE_ENV === 'development' ? hot(module)(App) : App);
