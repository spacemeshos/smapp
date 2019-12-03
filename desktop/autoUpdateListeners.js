import { ipcMain } from 'electron';
import { autoUpdater, CancellationToken } from 'electron-updater';
import type { UpdateCheckResult } from 'electron-updater';
import { ipcConsts } from '../app/vars';

const cancellationToken = new CancellationToken();

const subscribeToAutoUpdateListeners = ({ mainWindow }) => {
  autoUpdater.on('error', (error) => mainWindow.webContents.send(ipcConsts.WALLET_UPDATE_ERROR, { error }));

  autoUpdater.on('download-progress', (progressObj) => mainWindow.webContents.send(ipcConsts.DOWNLOAD_UPDATE_PROGRESS, { downloadPercent: progressObj.percent }));

  autoUpdater.once('update-downloaded', () => mainWindow.webContents.send(ipcConsts.DOWNLOAD_UPDATE_COMPLETED));

  ipcMain.on(ipcConsts.QUIT_AND_UPDATE, () => autoUpdater.quitAndInstall());

  ipcMain.on(ipcConsts.CHECK_WALLET_UPDATE, async (cancelBeforeCheck) => {
    cancelBeforeCheck && (await CancellationToken.cancel());
    const updateCheckResult: UpdateCheckResult = await autoUpdater.checkForUpdates(cancellationToken);
    const isUpdateAvailable = !!updateCheckResult.downloadPromise;
    mainWindow.webContents.send(ipcConsts.CHECK_WALLET_UPDATE_SUCCESS, { isUpdateAvailable });
  });
};

export default subscribeToAutoUpdateListeners;
