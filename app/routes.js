// @flow
import { Auth, Main, LocalNode, LocalNodeSetupPage, LocalNodeLoadingPage, LocalNodePage, Wallet, Overview, SendCoins } from '/screens';
import StoryBook from './components/StoryBook';

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

const wallet = [
  {
    path: '/main/wallet/overview',
    component: Overview
  },
  {
    path: '/main/wallet/sendCoins',
    component: SendCoins
  }
];

const routes = {
  app,
  main,
  localNode,
  wallet
};

export default routes;
