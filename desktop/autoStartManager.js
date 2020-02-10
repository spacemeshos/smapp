import AutoLaunch from 'auto-launch';
import { ipcConsts } from '../app/vars';
import StoreService from './storeService';

class AutoStartManager {
  static manager;

  static init = async () => {
    if (!AutoStartManager.manager) {
      AutoStartManager.manager = new AutoLaunch({
        name: 'Spacemesh',
        isHidden: true
      });
      if (StoreService.get({ key: 'isAutoStartEnabled' })) {
        await AutoStartManager.manager.enable();
      }
    }
  };

  static toggleAutoStart = async () => {
    try {
      const isEnabled = await AutoStartManager.manager.isEnabled();
      if (isEnabled) {
        await AutoStartManager.manager.disable();
      } else {
        await AutoStartManager.manager.enable();
      }
      StoreService.set({ key: 'isAutoStartEnabled', value: !isEnabled });
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  static isEnabled = async ({ event }) => {
    try {
      const isEnabled = await AutoStartManager.manager.isEnabled();
      StoreService.set({ key: 'isAutoStartEnabled', value: isEnabled });
      event.sender.send(ipcConsts.IS_AUTO_START_ENABLED_REQUEST_RESPONSE, isEnabled);
    } catch (error) {
      event.sender.send(ipcConsts.IS_AUTO_START_ENABLED_REQUEST_RESPONSE, false);
    }
  };
}

export default AutoStartManager;
