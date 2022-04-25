import { BrowserWindow, nativeTheme, Tray } from 'electron';
import { Wallet } from '../../shared/types';
import type NodeManager from '../NodeManager';
import type SmesherManager from '../SmesherManager';
import type WalletManager from '../WalletManager';

const getDefaultNetwork = () => ({
  netID: -1,
  netName: 'Unknown',
  conf: '',
  explorer: '',
  dash: '',
  grpcAPI: '',
  jsonAPI: '',
  minNodeVersion: '',
  maxNodeVersion: '',
  minSmappRelease: '',
  latestSmappRelease: '',
  smappBaseDownloadUrl: '',
  nodeBaseDownloadUrl: '',
});

export type Network = ReturnType<typeof getDefaultNetwork> & { [key: string]: any };

export interface AppContext {
  mainWindow?: BrowserWindow;
  tray?: Tray;
  isAppClosing: boolean;
  showWindowOnLoad: boolean;
  isDarkMode: boolean;
  networks: Network[];
  currentNetwork?: Network;
  wallet?: Wallet;
  walletPath?: string;
  managers: {
    node?: NodeManager;
    smesher?: SmesherManager;
    wallet?: WalletManager;
  };
}

export const getDefaultAppContext = (): AppContext => ({
  isAppClosing: false,
  showWindowOnLoad: true,
  isDarkMode: nativeTheme.shouldUseDarkColors,
  networks: [],
  managers: {},
});

export const hasManagers = (context: AppContext) => context.managers.smesher && context.managers.node && context.managers.wallet;
