// @flow
import {
  Auth,
  Welcome,
  UnlockWallet,
  CreateWallet,
  RestoreWallet,
  FileRestore,
  WordsRestore,
  Main,
  Node,
  NodeSetup,
  Wallet,
  Overview,
  SendCoins,
  RequestCoins,
  Backup,
  BackupRoot,
  FileBackup,
  TwelveWordsBackup,
  Transactions,
  Settings,
  Contacts,
  TestMe,
  Network
} from '/screens';

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

const auth = [
  {
    path: '/auth/welcome',
    component: Welcome
  },
  {
    path: '/auth/unlock',
    component: UnlockWallet
  },
  {
    path: '/auth/create',
    component: CreateWallet
  },
  {
    path: '/auth/restore',
    component: RestoreWallet
  },
  {
    path: '/auth/file-restore',
    component: FileRestore
  },
  {
    path: '/auth/words-restore',
    component: WordsRestore
  },
  {
    path: '/auth/node-setup',
    component: NodeSetup
  }
];

const main = [
  {
    path: '/main/wallet',
    component: Wallet
  },
  {
    path: '/main/node',
    component: Node
  },
  {
    path: '/main/backup',
    component: Backup
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
  },
  {
    path: '/main/network',
    component: Network
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
    path: '/main/wallet/requestCoins',
    component: RequestCoins
  }
];

const backup = [
  {
    path: '/main/backup/backup-root',
    component: BackupRoot
  },
  {
    path: '/main/backup/twelve-words-backup',
    component: TwelveWordsBackup
  },
  {
    path: '/main/backup/test-twelve-words-backup',
    component: TestMe
  },
  {
    path: '/main/backup/file-backup',
    component: FileBackup
  }
];

const routes = {
  app,
  auth,
  main,
  wallet,
  backup
};

export default routes;
