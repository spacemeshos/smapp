//
// Paths
//
export enum AuthPath {
  // Common
  Auth = '/auth',
  Welcome = '/auth/welcome',
  Leaving = '/auth/leaving',
  // Recover wallet
  Recover = '/auth/restore',
  RecoverFromFile = '/auth/file-restore',
  RecoverFromMnemonics = '/auth/words-restore',
  // Creation / recovering from mnemonics
  ConnectionType = '/auth/wallet-connection-type',
  WalletType = '/auth/wallet-type',
  CreateWallet = '/auth/create',
  // Unlock
  Unlock = '/auth/unlock',
  // Wallet settings
  ConnectToAPI = '/auth/connect-to-api',
  SwitchNetwork = '/auth/switch-network',
}

export enum MainPath {
  // Common
  Main = '/main',
  // Screens
  Wallet = '/main/wallet',
  Network = '/main/network',
  Dashboard = '/main/dash',
  Smeshing = '/main/node',
  SmeshingSetup = '/main/node-setup',
  BackupWallet = '/main/backup',
  Transactions = '/main/transactions',
  Contacts = '/main/contacts',
  Settings = '/main/settings',
}

export enum WalletPath {
  Overview = '/main/wallet/overview',
  Vault = '/main/wallet/vault',
  SpawnAccount = '/main/wallet/spawn-account',
  SendCoins = '/main/wallet/send-coins',
  RequestCoins = '/main/wallet/request-coins',
}

export enum BackupPath {
  Options = '/main/backup/backup-options',
  Mnemonics = '/main/backup/twelve-words-backup',
  TestMnemonics = '/main/backup/test-twelve-words-backup',
  File = '/main/backup/file-backup',
}

export type RouterPath = AuthPath | MainPath | WalletPath | BackupPath;
