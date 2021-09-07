import { BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import StoreService from './storeService';
import { MessageBoxOptions } from 'electron/main';
export default class UpdateManager {
  private mainWindow: BrowserWindow;

  UPDATE_INTERVAL = 1000 * 60 * 60 * 24;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    if (process.env.NODE_ENV === 'production' && StoreService.get('userSettings.promptForUpdate')) {
      log.transports.file.level = 'info';
      autoUpdater.logger = log;

      autoUpdater.setFeedURL({
        provider: 'generic'
      });

      this.checkForUpdates();

      autoUpdater.on('update-downloaded', this.onUpdateAvailable);

      setInterval(() => autoUpdater.checkForUpdates(), this.UPDATE_INTERVAL);
    }
  }

  async checkForUpdates(): Promise<string> {
    try {
      const { downloadPromise } = await autoUpdater.checkForUpdates();
      if (!downloadPromise) {
        return 'There are currently no updates available.';
      }
      return 'Downloading update...';
    } catch (error: unknown) {
      return 'Failed to fetch updates. Please try again';
    }
  }

  async onUpdateAvailable() {
    const options: MessageBoxOptions = {
      message: `An important App update is available. \t\nWould you like to update now?`,
      type: 'question',
      buttons: ['Yes', 'No']
    };
    const { response } = await dialog.showMessageBox(this.mainWindow, options);
    if (response === 0) {
      autoUpdater.downloadUpdate();
    } else if (response === 1) {
      StoreService.set('userSettings.promptForUpdate', false);
    }
  }
}
