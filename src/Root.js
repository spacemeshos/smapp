import React from 'react';
import { Provider } from 'react-redux';
import createStore from './redux/createStore';
import App from './App';

const store = createStore();

global.store = store; // to access the store outside of react components

const Root = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

export default Root;
