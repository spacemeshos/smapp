import { BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import StoreService from './storeService';
import { MessageBoxOptions } from 'electron/main';
import NotificationManager from './notificationManager';
import compareVersions from 'compare-versions';
export default class UpdateManager {
  private mainWindow: BrowserWindow;
  private notification: NotificationManager;

  private lastVersionPrompted: string = StoreService.get('userSettings.latestVersionPrompted');

  UPDATE_INTERVAL = 1000 * 60 * 60 * 24;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.notification = new NotificationManager(this.mainWindow);

    if (process.env.NODE_ENV === 'production') {
      log.transports.file.level = 'info';
      autoUpdater.logger = log;

      autoUpdater.channel = 'latest';
      autoUpdater.allowDowngrade = false;

      setInterval(() => autoUpdater.checkForUpdates(), this.UPDATE_INTERVAL);
    }
  }

  async updateApplication() {
    autoUpdater.downloadUpdate();
  }

  async checkForUpdates() {
    try {
      const { downloadPromise, updateInfo } = await autoUpdater.checkForUpdates();
      if (!downloadPromise) {
        dialog.showMessageBox({
          type: 'info',
          message: 'There are currently no updates available.'
        });
      }
      if (typeof this.lastVersionPrompted === 'undefined' || compareVersions(this.lastVersionPrompted, updateInfo.version) > 1) {
        autoUpdater.on('update-downloaded', () => this.onUpdateAvailable(updateInfo.version));
      }
    } catch (error: unknown) {
      this.notification.showNotification({ title: 'Error checking for updates', body: 'Check your internet connection' });
    }
  }

  async onUpdateAvailable(version: string) {
    const options: MessageBoxOptions = {
      message: `An important App update is available. \n\tWould you like to update now?`,
      type: 'question',
      buttons: ['Yes', 'No']
    };
    const { response } = await dialog.showMessageBox(this.mainWindow, options);
    if (response === 0) {
      this.updateApplication();
    } else if (response === 1) {
      StoreService.set('userSettings.latestVersionPrompted', version);
    }
  }
}
