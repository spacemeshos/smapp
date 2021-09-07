import { app, BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import NotificationManager from './notificationManager';
import StoreService from './storeService';

class UpdateManager {
  private notificationManager: NotificationManager;
  constructor(mainWindow: BrowserWindow) {
    this.notificationManager = new NotificationManager(mainWindow);
    if (autoUpdater.allowPrerelease && StoreService.get('releaseChannel') === 'stable') {
      StoreService.set('releaseChannel', 'dev');
    } else if (!autoUpdater.allowPrerelease && StoreService.get('releaseChannel') === 'dev') {
      StoreService.set('releaseChannel', 'stable');
      this.checkForUpdates();
    }

    autoUpdater.on('update-downloaded', this.onUpdateAvailable);

    if (StoreService.get('autoUpdate')) {
      setInterval(() => autoUpdater.checkForUpdates(), 1000 * 60 * 60 * 24);
      autoUpdater.checkForUpdates();
    }
  }

  async checkForUpdates(): Promise<void> {
    try {
      const { downloadPromise } = await autoUpdater.checkForUpdates();
      if (!downloadPromise) {
        dialog.showMessageBox({
          type: 'info',
          message: 'There are currently no updates available.'
        });
      }
    } catch (error: unknown) {
      this.notificationManager.showNotification({
        body: 'View the ',
        title: 'Update failed'
      });
    }
  }

  changeReleaseChannel(channel: 'stable' | 'dev') {
    autoUpdater.allowPrerelease = channel === 'dev';
    autoUpdater.allowDowngrade = true;

    StoreService.set('releaseChannel', channel);
  }

  onUpdateAvailable(): void {
    this.notificationManager.showNotification({
      body: `Please restart ${app.name} to update to the latest version.`,
      title: 'Update available',
      action: () => {
        app.relaunch();
        app.quit();
      }
    });
  }
}

export { UpdateManager };
