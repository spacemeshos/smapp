// @flow
import { Auth, Wallet, FullNode } from './screens';
import Root from './screens/Root';
import StoryBook from './components/StoryBook';
import FullNodeSetupPage from '/components/fullNode/FullNodeSetupPage';
import FullNodeLoadingPage from '/components/fullNode/FullNodeLoadingPage';
import FullNodePage from '/components/fullNode/FullNodePage';

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
    path: '/root/full-node',
    component: FullNode
  }
];

const localNode = [
  {
    path: '/root/full-node/full-node-setup',
    component: FullNodeSetupPage
  },
  {
    path: '/root/full-node/full-node-loading',
    component: FullNodeLoadingPage
  },
  {
    path: '/root/full-node/full-node-ready',
    component: FullNodePage
  }
];

const routes = {
  app,
  main,
  localNode
};

export default routes;
