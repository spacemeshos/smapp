import { BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import StoreService from './storeService';
import { MessageBoxOptions } from 'electron/main';
import NotificationManager from './notificationManager';
export default class UpdateManager {
  private mainWindow: BrowserWindow;
  private notification: NotificationManager;

  UPDATE_INTERVAL = 1000 * 60 * 60 * 24;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.notification = new NotificationManager(this.mainWindow);
    if (process.env.NODE_ENV === 'production' && StoreService.get('userSettings.promptForUpdate')) {
      log.transports.file.level = 'info';
      autoUpdater.logger = log;

      autoUpdater.channel = 'latest';
      autoUpdater.allowDowngrade = false;

      this.checkForUpdates();

      autoUpdater.on('update-downloaded', this.onUpdateAvailable);

      setInterval(() => autoUpdater.checkForUpdates(), this.UPDATE_INTERVAL);
    }
  }

  async updateApplication() {
    autoUpdater.downloadUpdate();
  }

  async checkForUpdates() {
    try {
      const { downloadPromise } = await autoUpdater.checkForUpdates();
      if (!downloadPromise) {
        dialog.showMessageBox({
          type: 'info',
          message: 'There are currently no updates available.'
        });
      }
    } catch (error: unknown) {
      this.notification.showNotification({ title: 'Error checking for updates', body: 'Check your internet connection' });
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
      this.updateApplication();
    } else if (response === 1) {
      StoreService.set('userSettings.promptForUpdate', false);
    }
  }
}
