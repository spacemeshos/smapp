import { ipcMain } from 'electron';
import AutoLaunch from 'auto-launch';
import { ipcConsts } from '../app/vars';
import { isLinuxAppImage } from '../shared/utils';
import Warning, { WarningType } from '../shared/warning';
import { isLinux, isMacOS, isWindows } from './osSystem';
import Logger from './logger';
import { captureMainException } from './sentry';
import StoreService from './storeService';

// Utils
const logger = Logger({ className: 'AutoStartManager' });

export const IS_AUTO_START_ENABLED = 'isAutoStartEnabled';
export const IS_AUTO_START_ON_SYSTEM_LAUNCH_ENABLED =
  'isAutoStartOnSystemLaunchEnabled';

// Results
type ToggleResult = {
  status: boolean;
  error?: string;
};

const handleFailure = (err: unknown) => {
  logger.error('AutoStartManager:handleFailure', err);

  if (
    isMacOS() &&
    err instanceof Error &&
    err.message &&
    /System Events/.test(err.message)
  ) {
    return {
      status: false,
      error:
        'Can not setup auto start: you need to provide permissions.\n\nGo to Settings -> Security & Privacy -> Privacy -> Automation and mark the checkbox next to "System Events" for the Spacemesh app.\nAnd then relaunch app or try again.',
    };
  }

  if (
    isLinux() &&
    err instanceof Error &&
    err.message &&
    /\.config\/autostart/.test(err.message)
  ) {
    return {
      status: false,
      error:
        "Failed to write to the autostart file in the user configuration directory.\n\nPlease check the file permissions for '~/.config/autostart/' and ensure that the necessary write permissions are granted.",
    };
  }

  if (
    isWindows() &&
    err instanceof Error &&
    err.message &&
    /Registry/.test(err.message)
  ) {
    return {
      status: false,
      error:
        'Failed to write the registry key for auto-start.\n\nPlease ensure that you have the necessary permissions to modify the registry.\n\nYou may need to run the application as an administrator or contact your system administrator for assistance.',
    };
  }

  err instanceof Error && captureMainException(err);

  return {
    status: false,
    error: `Can not setup auto launch: ${err}`,
  };
};

// Singleton class
class AutoStartManager {
  static service: AutoLaunch;

  static isSyncFinished = false;

  static init() {
    logger.debug('init() called...');
    AutoStartManager.service = new AutoLaunch({
      name: 'Spacemesh',
      isHidden: true,
      path: isLinuxAppImage() ? process.env.APPIMAGE : process.execPath,
    });

    const ipcEventMappings = [
      {
        event: ipcConsts.TOGGLE_AUTO_START_ON_SYSTEM_LAUNCH,
        handler: AutoStartManager.toggleAutoStart,
      },
      {
        event: ipcConsts.IS_AUTO_START_ON_SYSTEM_LAUNCH_ENABLED_REQUEST,
        handler: AutoStartManager.isEnabled,
      },
    ];

    ipcEventMappings.forEach(({ event, handler }) => {
      ipcMain.removeHandler(event);
      ipcMain.handle(event, handler);
    });
  }

  static isEnabledFromConfig = () =>
    StoreService.get(IS_AUTO_START_ENABLED) ??
    StoreService.get(IS_AUTO_START_ON_SYSTEM_LAUNCH_ENABLED);

  static isEnabled = async () => {
    try {
      return { status: await AutoStartManager.service.isEnabled() };
    } catch (err: any) {
      logger.error('isEnabled()', err);
      return handleFailure(err);
    }
  };

  static syncIsAutoStartOnLoginEnabled = async () => {
    try {
      // call the function only once on launch
      if (AutoStartManager.isSyncFinished) {
        return { status: true };
      }

      AutoStartManager.isSyncFinished = true;

      const isEnabled = await AutoStartManager.service.isEnabled();

      // migration process with auto deletion the flag from
      if (StoreService.has(IS_AUTO_START_ENABLED)) {
        // sync migration var
        StoreService.set(
          IS_AUTO_START_ON_SYSTEM_LAUNCH_ENABLED,
          // for AppImage, isEnabled() on start always false
          isLinuxAppImage()
            ? Boolean(StoreService.get(IS_AUTO_START_ENABLED))
            : isEnabled
        );

        // finish migration
        StoreService.remove(IS_AUTO_START_ENABLED);
      }

      const configIsEnabledStatus = StoreService.get(
        IS_AUTO_START_ON_SYSTEM_LAUNCH_ENABLED
      );

      if (configIsEnabledStatus !== isEnabled) {
        if (configIsEnabledStatus) {
          await AutoStartManager.enable();
        } else {
          await AutoStartManager.disable();
        }
      }

      return { status: true };
    } catch (err: any) {
      logger.error('syncIsAutoStartOnLoginEnabled()', err);
      throw new Warning(WarningType.SyncAutoStartAndConfig, {
        payload: {},
        message: handleFailure(err).error,
      });
    }
  };

  static toggleAutoStart = async () => {
    try {
      return (await AutoStartManager.service.isEnabled())
        ? await AutoStartManager.disable()
        : await AutoStartManager.enable();
    } catch (err: any) {
      logger.error('toggleAutoStart()', err);
      return handleFailure(err);
    }
  };

  static disable = async (n = 0): Promise<ToggleResult> => {
    let isEnabled: null | boolean = null;
    try {
      isEnabled = await AutoStartManager.service.isEnabled();
      if (isEnabled && n === 0) {
        await AutoStartManager.service.disable();
        StoreService.set(
          IS_AUTO_START_ON_SYSTEM_LAUNCH_ENABLED,
          await AutoStartManager.service.isEnabled()
        );
        return await AutoStartManager.disable(n + 1);
      } else if (isEnabled) {
        throw new Error('Cannot disable auto-launch for unknown reason');
      } else {
        return {
          status: false,
        };
      }
    } catch (err) {
      logger.error('disable()', err);
      throw err;
    }
  };

  static enable = async (n = 0): Promise<ToggleResult> => {
    let isEnabled: null | boolean = null;
    try {
      isEnabled = await AutoStartManager.service.isEnabled();
      if (!isEnabled && n === 0) {
        await AutoStartManager.service.enable();
        StoreService.set(
          IS_AUTO_START_ON_SYSTEM_LAUNCH_ENABLED,
          await AutoStartManager.service.isEnabled()
        );
        return await AutoStartManager.enable(n + 1);
      } else if (!isEnabled) {
        throw new Error(
          'Cannot enable auto-launch. Probably you already have another Spacemesh application in auto-launch'
        );
      } else {
        return { status: true };
      }
    } catch (err) {
      logger.error('enable()', err);
      throw err;
    }
  };
}

export default AutoStartManager;
