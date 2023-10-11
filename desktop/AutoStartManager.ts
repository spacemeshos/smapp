import { ipcMain } from 'electron';
import AutoLaunch from 'auto-launch';
import { ipcConsts } from '../app/vars';
import { isLinuxAppImage } from '../shared/utils';
import StoreService from './storeService';
import { isMacOS } from './osSystem';
import Logger from './logger';
import { captureMainException } from './sentry';

// Results

type ToggleResult = {
  status: boolean;
  error?: string;
};

const handleFailure = (err: unknown): ToggleResult => {
  if (
    isMacOS() &&
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

  err instanceof Error && captureMainException(err);

  return {
    status: false,
    error: `Can not setup auto launch: ${err}`,
  };
};

// Utils

const IS_AUTO_START_ENABLED = 'isAutoStartEnabled';
const storeValue = (val: boolean) =>
  StoreService.set(IS_AUTO_START_ENABLED, val);
const loadValue = () => StoreService.get(IS_AUTO_START_ENABLED);

const logger = Logger({ className: 'AutoStartManager' });

// Singletone class
class AutoStartManager {
  static service: AutoLaunch;

  static init() {
    logger.debug('init() called...');
    AutoStartManager.service = new AutoLaunch({
      name: 'Spacemesh',
      isHidden: true,
      path: isLinuxAppImage() ? process.env.APPIMAGE : process.execPath,
    });

    ipcMain.removeAllListeners(ipcConsts.TOGGLE_AUTO_START);
    ipcMain.handle(ipcConsts.TOGGLE_AUTO_START, () =>
      AutoStartManager.toggleAutoStart()
    );

    ipcMain.removeHandler(ipcConsts.IS_AUTO_START_ENABLED_REQUEST);
    ipcMain.handle(ipcConsts.IS_AUTO_START_ENABLED_REQUEST, () =>
      AutoStartManager.isEnabled()
    );

    // Syncronise value from persistent store with system auto-launch
    AutoStartManager.isEnabled()
      ? AutoStartManager.enable()
      : AutoStartManager.disable();
  }

  static isEnabled = () => loadValue();

  static toggleAutoStart = () =>
    AutoStartManager.isEnabled()
      ? AutoStartManager.disable()
      : AutoStartManager.enable();

  static disable = async (n = 0): Promise<ToggleResult> => {
    try {
      const isEnabled = await AutoStartManager.service.isEnabled();
      if (isEnabled && n === 0) {
        await AutoStartManager.service.disable();
        return await AutoStartManager.disable(n + 1);
      } else if (isEnabled) {
        throw new Error('Cannot disable auto-launch for unknown reason');
      } else {
        storeValue(false);
        return {
          status: false,
        };
      }
    } catch (err) {
      logger.error('disable()', err);
      return handleFailure(err);
    }
  };

  static enable = async (n = 0): Promise<ToggleResult> => {
    try {
      const isEnabled = await AutoStartManager.service.isEnabled();
      if (!isEnabled && n === 0) {
        await AutoStartManager.service.enable();
        return await AutoStartManager.enable(n + 1);
      } else if (!isEnabled) {
        throw new Error(
          'Cannot enable auto-launch. Probably you already have another Spacemesh application in auto-launch'
        );
      } else {
        storeValue(true);
        return { status: true };
      }
    } catch (err) {
      logger.error('enable()', err);
      return handleFailure(err);
    }
  };
}

export default AutoStartManager;
