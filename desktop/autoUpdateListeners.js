import { ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { ipcConsts } from '../app/vars';

const subscribeToAutoUpdateListeners = ({ mainWindow }) => {
  autoUpdater.on('error', (error) => mainWindow.webContents.send(ipcConsts.WALLET_UPDATE_ERROR, { error }));

  autoUpdater.on('update-downloaded', () => mainWindow.webContents.send(ipcConsts.DOWNLOAD_UPDATE_COMPLETED));

  ipcMain.on(ipcConsts.QUIT_AND_UPDATE, () => autoUpdater.quitAndInstall());

  ipcMain.on(ipcConsts.CHECK_WALLET_UPDATE, () => {
    autoUpdater.checkForUpdates();
    mainWindow.webContents.send(ipcConsts.CHECK_WALLET_UPDATE_SUCCESS);
    autoUpdater.once('download-progress', () => mainWindow.webContents.send(ipcConsts.DOWNLOAD_UPDATE_PROGRESS));
  });
};

export default subscribeToAutoUpdateListeners;
