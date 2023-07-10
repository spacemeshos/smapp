import {
  AuthPath,
  BackupPath,
  MainPath,
  RouterPath,
  WalletPath,
} from './routerPaths';
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
  NodeEventsLog,
  NodeSetup,
  Wallet,
  WalletConnectionType,
  WalletType,
  Leaving,
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
  Dashboard,
  ConnectToApi,
  SwitchNetwork,
} from './screens';
import SpawnAccount from './screens/wallet/SpawnAccount';
import ProtectWallet from './screens/auth/ProtectWallet';
import ProtectWalletTestMnemonic from './screens/auth/ProtectWalletTestMnemonic';
import WalletCreated from './screens/auth/WalletCreated';

//
// Types
//

export type Route = {
  path: RouterPath;
  component: any;
};

//
// Utils
//
const formatRoutes = (list: [RouterPath, any][]): Route[] =>
  list.map(([path, component]) => ({ path, component }));

//
// Map paths to components
//
const app = formatRoutes([
  [AuthPath.Auth, Auth],
  [MainPath.Main, Main],
]);

const auth = formatRoutes([
  [AuthPath.Welcome, Welcome],
  [AuthPath.ConnectionType, WalletConnectionType],
  [AuthPath.ConnectToAPI, ConnectToApi],
  [AuthPath.SwitchNetwork, SwitchNetwork],
  [AuthPath.Leaving, Leaving],
  [AuthPath.WalletType, WalletType],
  [AuthPath.CreateWallet, CreateWallet],
  [AuthPath.ProtectWallet, ProtectWallet],
  [AuthPath.ProtectWalletTestMnemonic, ProtectWalletTestMnemonic],
  [AuthPath.WalletCreated, WalletCreated],
  [AuthPath.Unlock, UnlockWallet],
  [AuthPath.Recover, RestoreWallet],
  [AuthPath.RecoverFromFile, FileRestore],
  [AuthPath.RecoverFromMnemonics, WordsRestore],
]);

const main = formatRoutes([
  [MainPath.Wallet, Wallet],
  [MainPath.Network, Network],
  [MainPath.Dashboard, Dashboard],
  [MainPath.SmeshingSetup, NodeSetup],
  [MainPath.Smeshing, Node],
  [MainPath.NodeEvents, NodeEventsLog],
  [MainPath.BackupWallet, Backup],
  [MainPath.Transactions, Transactions],
  [MainPath.Contacts, Contacts],
  [MainPath.Settings, Settings],
]);

const wallet = formatRoutes([
  [WalletPath.Overview, Overview],
  [WalletPath.Vault, Vault],
  [WalletPath.SpawnAccount, SpawnAccount],
  [WalletPath.SendCoins, SendCoins],
  [WalletPath.RequestCoins, RequestCoins],
]);

const backup = formatRoutes([
  [BackupPath.Options, BackupOptions],
  [BackupPath.Mnemonics, TwelveWordsBackup],
  [BackupPath.TestMnemonics, TestMe],
  [BackupPath.File, FileBackup],
]);

const path = { app, auth, main, wallet, backup };

export default path;
