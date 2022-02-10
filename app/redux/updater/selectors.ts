import { RootState } from '../../types';

export const getUpdateInfo = (state: RootState) => state.updater.availableUpdate;
export const isUpdateAvailable = (state: RootState) => !!getUpdateInfo(state);
export const isUpdateDownloading = (state: RootState) => state.updater.isDownloading;
export const isUpdateDownloaded = (state: RootState) => !!state.updater.downloadedUpdate;

export const getProgressInfo = (state: RootState) => state.updater.progress;
export const getError = (state: RootState) => state.updater.error;
