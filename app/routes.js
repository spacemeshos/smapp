import {
  SplashScreen,
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
  BackupOptions,
  FileBackup,
  TwelveWordsBackup,
  Transactions,
  Settings,
  Contacts,
  Network,
  TestMe,
  Vault,
  Dashboard
} from '/screens';

const app = [
  {
    path: '/pre',
    component: SplashScreen
  },
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
  }
];

const main = [
  {
    path: '/main/wallet',
    component: Wallet
  },
  {
    path: '/main/network',
    component: Network
  },
  {
    path: '/main/dash',
    component: Dashboard
  },
  {
    path: '/main/node-setup',
    component: NodeSetup
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
  }
];

const wallet = [
  {
    path: '/main/wallet/overview',
    component: Overview
  },
  {
    path: '/main/wallet/vault',
    component: Vault
  },
  {
    path: '/main/wallet/send-coins',
    component: SendCoins
  },
  {
    path: '/main/wallet/request-coins',
    component: RequestCoins
  }
];

const backup = [
  {
    path: '/main/backup/backup-options',
    component: BackupOptions
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
