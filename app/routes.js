// @flow
import { Auth } from './screens';
import Root from './screens/Root';

const routes = {
  HOME: {
    path: '/auth',
    component: Auth
  },
  ROOT: {
    path: '/root',
    component: Root
  }
};

export default routes;
