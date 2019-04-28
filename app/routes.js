// @flow
import { Auth, Main, LocalNode, Wallet, Overview, SendCoins, Backup, TwelveWordsBackup, Transactions, Settings, Contacts, TestMe } from '/screens';

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
    path: '/main/wallet',
    component: Wallet
  },
  {
    path: '/main/local-node',
    component: LocalNode
  },
  {
    path: '/main/transactions',
    component: Transactions
  },
  {
    path: '/main/contacts',
    component: Contacts
  },
  {
    path: '/main/settings',
    component: Settings
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
  },
  {
    path: '/main/wallet/backup',
    component: Backup
  },
  {
    path: '/main/wallet/twelve-words-backup',
    component: TwelveWordsBackup
  },
  {
    path: '/main/wallet/test-twelve-words-backup',
    component: TestMe
  }
];

const routes = {
  app,
  main,
  wallet
};

export default routes;
