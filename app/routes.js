// @flow
import AuthPage from './screens/AuthPage';
import RootPage from './screens/RootPage';

const routes = {
  HOME: {
    path: '/auth',
    component: AuthPage
  },
  ROOT: {
    path: '/root',
    component: RootPage
  }
};

export default routes;
