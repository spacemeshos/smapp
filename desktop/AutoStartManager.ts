import { ipcMain } from 'electron';
import AutoLaunch from 'auto-launch';
import { captureException } from '@sentry/electron';
import { ipcConsts } from '../app/vars';
import { isLinuxAppImage } from '../shared/utils';
import StoreService from './storeService';

export const IS_AUTO_START_ENABLED = 'isAutoStartEnabled';

type ToggleResult = {
  status: boolean;
  error?: string;
};

class AutoStartManager {
  private manager: AutoLaunch;

  constructor() {
    const options: { name: string; isHidden: boolean; path?: string } = {
      name: 'Spacemesh',
      isHidden: true,
    };

    // Linux issue with path to the application
    if (isLinuxAppImage()) {
      options.path = process.env.APPIMAGE;
    }

    this.manager = new AutoLaunch(options);

    if (this.isEnabled()) {
      this.enable();
    }

    ipcMain.removeAllListeners(ipcConsts.TOGGLE_AUTO_START);
    ipcMain.handle(ipcConsts.TOGGLE_AUTO_START, async () =>
      this.toggleAutoStart()
    );

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

  disable = async (): Promise<ToggleResult> => {
    try {
      const isEnabled = await this.manager.isEnabled();
      if (isEnabled) {
        await this.manager.disable();
        return await this.disable();
      } else {
        StoreService.set(IS_AUTO_START_ENABLED, false);
        return {
          status: false,
        };
      }
    } catch (err) {
      StoreService.set(IS_AUTO_START_ENABLED, false);
      if (
        process.platform === 'darwin' &&
        err instanceof Error &&
        err.message &&
        /System Events/.test(err.message)
      ) {
        // Since User disables the feature it does not matter
        // do we have permissions or not — just "turn it off"
        return { status: false };
      }

      captureException(err);
      return {
        status: false,
        error: `Can not setup auto launch: ${err}`,
      };
    }
  };

  enable = async (): Promise<ToggleResult> => {
    try {
      const isEnabled = await this.manager.isEnabled();
      if (!isEnabled) {
        await this.manager.enable();
        return await this.enable();
      } else {
        StoreService.set(IS_AUTO_START_ENABLED, true);
        return { status: true };
      }
    } catch (err) {
      if (
        process.platform === 'darwin' &&
        err instanceof Error &&
        err.message &&
        /System Events/.test(err.message)
      ) {
        return {
          status: false,
          error:
            'Can not setup auto start: you need to provide permissions.\nGo to Settings -> Security & Privacy -> Privacy -> Automation and mark the checkbox next to "System Events" for the Spacemesh app.\nAnd then try again.',
        };
      }
      captureException(err);
      return {
        status: false,
        error: `Can not setup auto launch: ${err}`,
      };
    }
  };
}

export default AutoStartManager;
