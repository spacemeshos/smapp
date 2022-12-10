import os from 'os';
import { ipcMain } from 'electron';
import AutoLaunch from 'auto-launch';
import { captureException } from '@sentry/electron/main';
import { ipcConsts } from '../renderer/vars';
import StoreService from './storeService';

export const IS_AUTO_START_ENABLED = 'isAutoStartEnabled';

class AutoStartManager {
  private manager: AutoLaunch;

  constructor() {
    const options: { name: string; isHidden: boolean; path?: string } = {
      name: 'Spacemesh',
      isHidden: true,
    };

    // Linux issue with path to the application
    if (os.platform() === 'linux' && process.env.APPIMAGE) {
      options.path = process.env.APPIMAGE;
    }

    this.manager = new AutoLaunch(options);

    if (this.isEnabled()) {
      this.enable();
    }

    ipcMain.removeAllListeners(ipcConsts.TOGGLE_AUTO_START);
    ipcMain.on(ipcConsts.TOGGLE_AUTO_START, async () => this.toggleAutoStart());

    ipcMain.removeHandler(ipcConsts.IS_AUTO_START_ENABLED_REQUEST);
    ipcMain.handle(ipcConsts.IS_AUTO_START_ENABLED_REQUEST, () =>
      this.isEnabled()
    );
  }

  toggleAutoStart = async () => {
    return StoreService.get(IS_AUTO_START_ENABLED)
      ? this.disable()
      : this.enable();
  };

  isEnabled = () => {
    return StoreService.get(IS_AUTO_START_ENABLED);
  };

  disable() {
    this.manager
      .isEnabled()
      .then((isEnabled) => {
        if (isEnabled) {
          this.manager.disable();
        }
        return false;
      })
      .catch(captureException);
    StoreService.set(IS_AUTO_START_ENABLED, false);
  }

  enable() {
    this.manager
      .isEnabled()
      .then((isEnabled) => {
        if (!isEnabled) {
          this.manager.enable();
        }
        return true;
      })
      .catch(captureException);
    StoreService.set(IS_AUTO_START_ENABLED, true);
  }
}

export default AutoStartManager;
