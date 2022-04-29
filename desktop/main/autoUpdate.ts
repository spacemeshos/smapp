import { ipcMain, Notification } from 'electron';
import { ProgressInfo } from 'builder-util-runtime';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import logger from 'electron-log';
import { SemVer } from 'semver';

import pkg from '../../package.json';
import { ipcConsts } from '../../app/vars';
import { isDev, isNetError } from '../utils';
import { AppContext } from './context';
import { HOUR } from './constants';

autoUpdater.logger = logger;

// IPC
const notify = <T extends unknown>(channel: ipcConsts) => (
  context: AppContext,
  info: T
) =>
  (context.mainWindow &&
    context.mainWindow.webContents.send(channel, info) &&
    true) ||
  false;

const notifyUpdateAvailble = notify<UpdateInfo>(ipcConsts.AU_AVAILABLE);
const notifyDownloadProgress = notify<ProgressInfo>(
  ipcConsts.AU_DOWNLOAD_PROGRESS
);
const notifyUpdateDownloaded = notify<UpdateInfo>(ipcConsts.AU_DOWNLOADED);
const notifyDownloadStarted = notify<void>(ipcConsts.AU_DOWNLOAD_STARTED);
const notifyError = notify<Error>(ipcConsts.AU_ERROR);

// Utils
const getCurrentVersion = () =>
  isDev() ? new SemVer(pkg.version) : autoUpdater.currentVersion;

//
export const checkForUpdates = async (
  context: AppContext,
  autoDownload = false
) => {
  if (!context.currentNetwork) return null;
  const currentVersion = getCurrentVersion();
  const { latestSmappRelease, smappBaseDownloadUrl } = context.currentNetwork;
  const isGreaterVersion = currentVersion.compare(latestSmappRelease) === 1;
  const isNotLatestVersion = currentVersion.compare(latestSmappRelease) === -1;
  // TODO: isOutdatedVersion is useless until we don't have a special handling for it
  // const isOutdatedVersion = currentVersion.compare(minSmappRelease) === -1;
  if (isNotLatestVersion || isGreaterVersion) {
    autoUpdater.allowDowngrade = isGreaterVersion;
    autoUpdater.autoDownload = autoDownload;
    const feedUrl = `${smappBaseDownloadUrl}/v${latestSmappRelease}`;
    autoUpdater.setFeedURL(feedUrl);
    try {
      const result = await autoUpdater.checkForUpdates();
      if (!result) return null;
      const { updateInfo } = result;
      notifyUpdateAvailble(context, updateInfo);

      if (context.mainWindow?.isMinimized()) {
        const notification = new Notification({
          title: `New version ${updateInfo.version} is available!`,
          subtitle: `Current version: ${currentVersion.format()}`,
          body: `Open Smapp to install update.`,
        });
        notification.on('click', () => context.mainWindow?.show());
        notification.show();
      }

      return updateInfo;
    } catch (err) {
      if (err instanceof Error && !isNetError(err)) {
        notifyError(context, err as Error);
      }
      return null;
    }
  }

  return null;
};

const downloadUpdate = (context: AppContext) => checkForUpdates(context, true);

export const subscribe = (context: AppContext) => {
  let downloadedUpdate: UpdateInfo | null = null;

  autoUpdater.on('download-progress', (info: ProgressInfo) => {
    logger.log('download-progress', info);
    notifyDownloadProgress(context, info);
  });
  autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
    logger.log('update-downloaded', info);
    autoUpdater.autoInstallOnAppQuit = true;
    notifyUpdateDownloaded(context, info);
  });
  autoUpdater.on('error', (err: Error) => {
    if (!isNetError(err)) {
      notifyError(context, err);
    }
  });

  ipcMain.on(ipcConsts.AU_CHECK_UPDATES, () => checkForUpdates(context));
  setInterval(() => checkForUpdates(context), 24 * HOUR);

  ipcMain.on(ipcConsts.AU_REQUEST_DOWNLOAD, async () => {
    downloadedUpdate = await downloadUpdate(context);
    notifyDownloadStarted(context);
  });

  ipcMain.on(ipcConsts.AU_REQUEST_INSTALL, () => {
    if (!downloadedUpdate) return;
    autoUpdater.quitAndInstall();
  });
};

export default {
  checkForUpdates,
  subscribe,
};
