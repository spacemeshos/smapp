// @flow
import { Auth, Wallet, FullNode } from './screens';
import Root from './screens/Root';
import StoryBook from './components/StoryBook';

const routes = {
  app: {
    HOME: {
      path: '/auth',
      component: Auth
    },
    ROOT: {
      path: '/root',
      component: Root
    }
  },
  root: {
    STORYBOOK: {
      path: '/root/story-book',
      component: StoryBook
    },
    WALLET: {
      path: '/root/wallet',
      component: Wallet
    },
    FULLNODE: {
      path: '/root/full-node',
      component: FullNode
    }
  }
  // fullNode: {
  //   SETUP: {
  //     path: '/root/full-node/full-node-setup',
  //     component: FullNodeSetupPage
  //   },
  //   LOADING: {
  //     path: '/root/full-node/full-node-loading',
  //     component: FullNodeLoadingPage
  //   },
  //   READY: {
  //     path: '/root/full-node/full-node-ready',
  //     component: FullNodePage
  //   }
  // }
};

export default routes;
