// @flow
import { Auth, Main, Wallet, LocalNode } from './screens';
import StoryBook from './components/StoryBook';
import LocalNodeSetupPage from '/components/localNode/LocalNodeSetupPage';
import LocalNodeLoadingPage from '/components/localNode/LocalNodeLoadingPage';
import LocalNodePage from '/components/localNode/LocalNodePage';

const app = [
  {
    path: '/auth',
    component: Auth
  },
  {
    path: '/main',
    component: Main
  }
];

const main = [
  {
    path: '/main/story-book',
    component: StoryBook
  },
  {
    path: '/main/wallet',
    component: Wallet
  },
  {
    path: '/main/local-node',
    component: LocalNode
  }
];

const localNode = [
  {
    path: '/main/local-node/local-node-setup',
    component: LocalNodeSetupPage
  },
  {
    path: '/main/local-node/local-node-loading',
    component: LocalNodeLoadingPage
  },
  {
    path: '/main/local-node/local-node-ready',
    component: LocalNodePage
  }
];

const routes = {
  app,
  main,
  localNode
};

export default routes;
