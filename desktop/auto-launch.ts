import { ipcMain } from 'electron';
import AutoLaunch from 'auto-launch';
import { ipcConsts } from '../app/vars';
import StoreService from './storeService';

export const IS_AUTO_START_ENABLED = 'isAutoStartEnabled';

class AutoStartManager {
  // @ts-ignore
  private manager;

  constructor() {
    this.init();

    ipcMain.on(ipcConsts.TOGGLE_AUTO_START, async () => {
      await this.toggleAutoStart();
    });

    ipcMain.handle(ipcConsts.IS_AUTO_START_ENABLED_REQUEST, async () => {
      const res = await this.isEnabled();
      return res;
    });
  }

  init = async () => {
    if (!this.manager) {
      this.manager = new AutoLaunch({
        name: 'Spacemesh',
        isHidden: true,
      });
      if (StoreService.get(IS_AUTO_START_ENABLED)) {
        await this.manager.enable();
      }
    }
  };

  toggleAutoStart = async () => {
    try {
      const isEnabled = await this.manager.isEnabled();
      if (isEnabled) {
        await this.manager.disable();
      } else {
        await this.manager.enable();
      }
      StoreService.set(IS_AUTO_START_ENABLED, !isEnabled);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  isEnabled = async () => {
    try {
      const isEnabled = await this.manager.isEnabled();
      StoreService.set(IS_AUTO_START_ENABLED, isEnabled);
      return isEnabled;
    } catch (error) {
      return false;
    }
  };
}

export default AutoStartManager;
