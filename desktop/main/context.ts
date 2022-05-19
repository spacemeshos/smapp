import { BrowserWindow, nativeTheme, Tray } from 'electron';
import { Subject } from 'rxjs';
import { Wallet } from '../../shared/types';
import { Managers, AppState, Network, AppStore } from './app.types';

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
  managers: Partial<Managers>;
  state: AppStore;
}

export const getDefaultAppContext = (): AppContext => ({
  isAppClosing: false,
  showWindowOnLoad: true,
  isDarkMode: nativeTheme.shouldUseDarkColors,
  networks: [],
  managers: {},
  state: {} as AppStore,
});

export const hasManagers = (context: AppContext) =>
  context.managers.smesher && context.managers.node && context.managers.wallet;
