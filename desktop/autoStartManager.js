import AutoLaunch from 'auto-launch';
import { ipcConsts } from '../app/vars';

class AutoStartManager {
  constructor(store) {
    this.autoStartManager = new AutoLaunch({
      name: 'Spacemesh',
      isHidden: true
    });
    this.store = store;
    if (this.store.get('isAutoStartEnabled')) {
      this.autoStartManager.enable();
    }
  }

  toggleAutoStart = async () => {
    try {
      const isEnabled = await this.autoStartManager.isEnabled();
      if (isEnabled) {
        this.autoStartManager.disable();
      } else {
        this.autoStartManager.enable();
      }
      this.store.set('isAutoStartEnabled', !isEnabled);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  isEnabled = async ({ event }) => {
    try {
      const isEnabled = await this.autoStartManager.isEnabled();
      this.store.set('isAutoStartEnabled', isEnabled);
      event.sender.send(ipcConsts.IS_AUTO_START_ENABLED_REQUEST_RESPONSE, isEnabled);
    } catch (error) {
      event.sender.send(ipcConsts.IS_AUTO_START_ENABLED_REQUEST_RESPONSE, false);
    }
  };
}

export default AutoStartManager;
