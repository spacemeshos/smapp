import React from 'react';
import { render } from 'react-dom';
// import { AppContainer } from 'react-hot-loader';
import App from './App';
import { configureStore } from './redux/configureStore';

const store = configureStore();

const renderWrapper = (Component) => {
  render(<Component store={store} />, document.getElementById('root'));
};

renderWrapper(App);
