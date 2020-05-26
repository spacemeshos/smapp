import { ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import { ipcConsts } from '../app/vars';

class UpdateManager {
  constructor(mainWindow) {
    autoUpdater.logger = null;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.autoDownload = true;
    this.mainWindow = mainWindow;
    this.isDownloadingUpdate = false;
    this.subscribeToEvents();
  }

  subscribeToEvents = () => {
    autoUpdater.on('error', () => {
      this.isDownloadingUpdate = false;
    });

    autoUpdater.on('update-downloaded', async () => {
      this.isDownloadingUpdate = false;
      await this.showUpdateDialog();
    });

    ipcMain.on(ipcConsts.CHECK_WALLET_UPDATE, () => {
      if (process.env.NODE_ENV === 'production') {
        autoUpdater.checkForUpdates();
        autoUpdater.once('download-progress', () => {
          this.isDownloadingUpdate = true;
        });
      }
    });

    ipcMain.handle(ipcConsts.IS_UPDATE_DOWNLOADING, () => this.isDownloadingUpdate);
  };

  showUpdateDialog = async () => {
    const options = {
      title: 'App Update Available',
      message: '\nAn important App update is available.\nWould you like to install it now?\n\n',
      buttons: ['YES', 'Cancel']
    };
    const { response } = await dialog.showMessageBox(this.mainWindow, options);
    if (response === 0) {
      autoUpdater.quitAndInstall();
    }
  };
}

export default UpdateManager;
