import { BrowserWindow, nativeTheme, Tray } from 'electron';
import { PublicService } from '../../shared/types';
import NodeManager from '../NodeManager';
import SmesherManager from '../SmesherManager';

export interface AppContext {
  mainWindow?: BrowserWindow;
  tray?: Tray;
  isAppClosing: boolean;
  showWindowOnLoad: boolean;
  isDarkMode: boolean;
  publicApis: PublicService[];
  managers: {
    node?: NodeManager;
    smesher?: SmesherManager;
  };
}

export const getDefaultAppContext = (): AppContext => ({
  isAppClosing: false,
  showWindowOnLoad: true,
  isDarkMode: nativeTheme.shouldUseDarkColors,
  publicApis: [],
  managers: {},
});
