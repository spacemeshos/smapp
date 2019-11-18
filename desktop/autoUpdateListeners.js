import path from 'path';
import { ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { ipcConsts } from '../app/vars';
import FileManager from './fileManager';

const awsBucketPrefix = 'https://s3.amazonaws.com/app-binaries.spacemesh.io';

const subscribeToAutoUpdateListeners = ({ mainWindow }) => {
  autoUpdater.on('update-available', (info) => {
    const walletUpdatePath = path.join(awsBucketPrefix, info.path);
    mainWindow.webContents.send(ipcConsts.GET_WALLET_UPDATE_STATUS_SUCCESS, { walletUpdatePath });
  });

  autoUpdater.on('update-not-available', () => {
    mainWindow.webContents.send(ipcConsts.GET_WALLET_UPDATE_STATUS_SUCCESS, { walletUpdatePath: '' });
  });

  autoUpdater.on('error', (error) => {
    mainWindow.webContents.send(ipcConsts.GET_WALLET_UPDATE_STATUS_FAILURE, { error });
  });

  ipcMain.on(ipcConsts.DOWNLOAD_UPDATE, (event, request) => FileManager.downloadUpdate({ event, ...request }));

  ipcMain.on(ipcConsts.GET_WALLET_UPDATE_STATUS, () => autoUpdater.checkForUpdatesAndNotify());
};

export { subscribeToAutoUpdateListeners }; // eslint-disable-line import/prefer-default-export
