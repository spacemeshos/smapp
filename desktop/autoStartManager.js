import AutoLaunch from 'auto-launch';
import { ipcConsts } from '../app/vars';

const Store = require('electron-store');

const store = new Store();

class WalletAutoStarter {
  constructor() {
    this.walletAutoStarter = new AutoLaunch({
      name: 'Spacemesh',
      isHidden: true
    });
    if (store.get('isAutoStartEnabled')) {
      this.walletAutoStarter.enable();
    }
  }

  toggleAutoStart = async () => {
    try {
      const isEnabled = await this.walletAutoStarter.isEnabled();
      if (isEnabled) {
        this.walletAutoStarter.disable();
      } else {
        this.walletAutoStarter.enable();
      }
      store.set('isAutoStartEnabled', !isEnabled);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  isEnabled = async ({ event }) => {
    try {
      const isEnabled = store.get('isAutoStartEnabled');
      event.sender.send(ipcConsts.IS_AUTO_START_ENABLED_REQUEST_RESPONSE, isEnabled);
    } catch (error) {
      event.sender.send(ipcConsts.IS_AUTO_START_ENABLED_REQUEST_RESPONSE, false);
    }
  };
}

export default new WalletAutoStarter();
