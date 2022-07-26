import { existsSync } from 'fs';
import os from 'os';
import { app, ipcMain } from 'electron';
import { ipcConsts } from '../app/vars';
import StoreService from './storeService';
import { NODE_CONFIG_FILE } from './main/constants';

const IS_AUTO_START_ENABLED = 'isAutoStartEnabled';

export const getWasOpenAtLaunchValue = () => {
  const platform = os.platform();
  const isConfigFileExists = existsSync(NODE_CONFIG_FILE);

  if (!isConfigFileExists) {
    return false;
  }

  if (platform === 'darwin') {
    return app.getLoginItemSettings().wasOpenedAtLogin;
  }

  if (platform === 'linux') {
    return StoreService.get(IS_AUTO_START_ENABLED);
  }

  if (platform === 'win32') {
    return app.getLoginItemSettings().executableWillLaunchAtLogin;
  }

  return StoreService.get(IS_AUTO_START_ENABLED);
};

export default function () {
  // Linux fallback
  if (StoreService.get(IS_AUTO_START_ENABLED)) {
    app.setLoginItemSettings({
      openAtLogin: true,
    });
  }

  // Auto start listeners
  ipcMain.on(ipcConsts.TOGGLE_AUTO_START, () => {
    const state = !app.getLoginItemSettings().openAtLogin;
    StoreService.set(IS_AUTO_START_ENABLED, state);

    app.setLoginItemSettings({
      openAtLogin: state,
    });

    return state;
  });

  ipcMain.handle(
    ipcConsts.IS_AUTO_START_ENABLED_REQUEST,
    () =>
      app.getLoginItemSettings().openAtLogin ||
      StoreService.get(IS_AUTO_START_ENABLED) // Linux fallback
  );
}
