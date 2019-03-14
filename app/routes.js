// @flow
import { Auth, Wallet, LocalNode } from './screens';
import Root from './screens/Root';
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
    path: '/root',
    component: Root
  }
];

const main = [
  {
    path: '/root/story-book',
    component: StoryBook
  },
  {
    path: '/root/wallet',
    component: Wallet
  },
  {
    path: '/root/local-node',
    component: LocalNode
  }
];

const localNode = [
  {
    path: '/root/local-node/local-node-setup',
    component: LocalNodeSetupPage
  },
  {
    path: '/root/local-node/local-node-loading',
    component: LocalNodeLoadingPage
  },
  {
    path: '/root/local-node/local-node-ready',
    component: LocalNodePage
  }
];

const routes = {
  app,
  main,
  localNode
};

export default routes;
