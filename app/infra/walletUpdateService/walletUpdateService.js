// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { listenerCleanup } from '/infra/utils';

class WalletUpdateService {
  static getWalletUpdateStatus() {
    ipcRenderer.send(ipcConsts.GET_WALLET_UPDATE_STATUS);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_WALLET_UPDATE_STATUS_SUCCESS, (event, xml) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_WALLET_UPDATE_STATUS_SUCCESS, ipcConsts.WALLET_UPDATE_ERROR] });
        resolve(xml);
      });
      ipcRenderer.once(ipcConsts.WALLET_UPDATE_ERROR, (event, args) => {
        listenerCleanup({
          ipcRenderer,
          channels: [ipcConsts.GET_WALLET_UPDATE_STATUS_SUCCESS, ipcConsts.WALLET_UPDATE_ERROR, ipcConsts.DOWNLOAD_UPDATE_SUCCESS, ipcConsts.DOWNLOAD_UPDATE_PROGRESS]
        });
        reject(args);
      });
    });
  }

  static listenToDownloadUpdate({
    onProgress,
    onDownloadUpdateCompleted
  }: {
    onProgress: ({ receivedBytes: number, totalBytes: number }) => void,
    onDownloadUpdateCompleted: () => void
  }) {
    ipcRenderer.on(ipcConsts.DOWNLOAD_UPDATE_PROGRESS, (event, progress: { receivedBytes: number, totalBytes: number }) => {
      onProgress && onProgress({ ...progress });
    });
    ipcRenderer.once(ipcConsts.DOWNLOAD_UPDATE_SUCCESS, () => {
      listenerCleanup({ ipcRenderer, channels: [ipcConsts.DOWNLOAD_UPDATE_SUCCESS, ipcConsts.DOWNLOAD_UPDATE_PROGRESS] });
      onDownloadUpdateCompleted && onDownloadUpdateCompleted();
    });
  }

  static quitAppAndInstallUpdate() {
    ipcRenderer.send(ipcConsts.QUIT_APP_AND_INSTALL_UPDATE);
  }
}

export default WalletUpdateService;
