// @flow
import HomePage from './screens/HomePage';
import CounterPage from './screens/CounterPage';
import RootPage from './screens/RootPage';

const routes = {
  HOME: {
    path: '/',
    component: HomePage
    },
  COUNTER: {
    path: '/counter',
    component: CounterPage
    },
  ROOT: {
    path: '/root',
    component: RootPage
  }
};

export default routes;
