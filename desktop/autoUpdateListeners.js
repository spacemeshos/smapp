import { ipcMain } from 'electron';
import { autoUpdater, CancellationToken } from 'electron-updater';
import { ipcConsts } from '../app/vars';

const cancellationToken = new CancellationToken();

const subscribeToAutoUpdateListeners = ({ mainWindow }) => {
  autoUpdater.on('update-available', () => mainWindow.webContents.send(ipcConsts.GET_WALLET_UPDATE_STATUS_SUCCESS, { isUpdateAvailable: true }));

  autoUpdater.on('update-not-available', () => mainWindow.webContents.send(ipcConsts.GET_WALLET_UPDATE_STATUS_SUCCESS, { isUpdateAvailable: false }));

  autoUpdater.on('error', (error) => mainWindow.webContents.send(ipcConsts.WALLET_UPDATE_ERROR, { error }));

  autoUpdater.on('download-progress', (progressObj) =>
    mainWindow.webContents.send(ipcConsts.DOWNLOAD_UPDATE_PROGRESS, { receivedBytes: progressObj.transferred, totalBytes: progressObj.total })
  );

  autoUpdater.on('update-downloaded', () => mainWindow.webContents.send(ipcConsts.DOWNLOAD_UPDATE_SUCCESS));

  ipcMain.on(ipcConsts.QUIT_APP_AND_INSTALL_UPDATE, () => autoUpdater.quitAndInstall());

  ipcMain.on(ipcConsts.DOWNLOAD_UPDATE, () => autoUpdater.downloadUpdate(cancellationToken));

  ipcMain.on(ipcConsts.GET_WALLET_UPDATE_STATUS, () => {
    autoUpdater.autoDownload = false;
    autoUpdater.checkForUpdates();
  });
};

export { subscribeToAutoUpdateListeners }; // eslint-disable-line import/prefer-default-export
