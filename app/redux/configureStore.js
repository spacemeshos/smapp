// @flow
import configureStoreDev from './configureStore.dev';
import configureStoreProd from './configureStore.prod';
import type { Store } from '/types';

const selectedConfigureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

const store: Store = selectedConfigureStore();
export default store;
