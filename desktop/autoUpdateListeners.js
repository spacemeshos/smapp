import { ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import type { UpdateCheckResult } from 'electron-updater';
import { ipcConsts } from '../app/vars';

const subscribeToAutoUpdateListeners = ({ mainWindow }) => {
  autoUpdater.on('error', (error) => mainWindow.webContents.send(ipcConsts.WALLET_UPDATE_ERROR, { error }));

  autoUpdater.on('update-downloaded', () => mainWindow.webContents.send(ipcConsts.DOWNLOAD_UPDATE_COMPLETED));

  ipcMain.on(ipcConsts.QUIT_AND_UPDATE, () => autoUpdater.quitAndInstall());

  ipcMain.on(ipcConsts.CHECK_WALLET_UPDATE, async () => {
    const updateCheckResult: UpdateCheckResult = await autoUpdater.checkForUpdates();
    const isUpdateAvailable = !!updateCheckResult.downloadPromise;
    mainWindow.webContents.send(ipcConsts.CHECK_WALLET_UPDATE_SUCCESS, { isUpdateAvailable });
    autoUpdater.on('download-progress', () => mainWindow.webContents.send(ipcConsts.DOWNLOAD_UPDATE_PROGRESS));
  });
};

export default subscribeToAutoUpdateListeners;
