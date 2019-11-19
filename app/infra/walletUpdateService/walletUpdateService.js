// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { listenerCleanup } from '/infra/utils';
import { localStorageService } from '/infra/storageService';

class WalletUpdateService {
  static getWalletUpdateStatus() {
    ipcRenderer.send(ipcConsts.GET_WALLET_UPDATE_STATUS);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_WALLET_UPDATE_STATUS_SUCCESS, (event, xml) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_WALLET_UPDATE_STATUS_SUCCESS, ipcConsts.GET_WALLET_UPDATE_STATUS_FAILURE] });
        resolve(xml);
      });
      ipcRenderer.once(ipcConsts.GET_WALLET_UPDATE_STATUS_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_WALLET_UPDATE_STATUS_SUCCESS, ipcConsts.GET_WALLET_UPDATE_STATUS_FAILURE] });
        reject(args);
      });
    });
  }

  static downloadUpdate({ walletUpdatePath, onProgress }: { walletUpdatePath: string, onProgress: ({ receivedBytes: number, totalBytes: number }) => void }) {
    ipcRenderer.send(ipcConsts.DOWNLOAD_UPDATE, { walletUpdatePath });
    ipcRenderer.on(ipcConsts.DOWNLOAD_UPDATE_PROGRESS, (event, progress: { receivedBytes: number, totalBytes: number }) => {
      onProgress && onProgress({ ...progress });
    });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.DOWNLOAD_UPDATE_SUCCESS, (event, xml) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.DOWNLOAD_UPDATE_SUCCESS, ipcConsts.DOWNLOAD_UPDATE_FAILURE, ipcConsts.DOWNLOAD_UPDATE_PROGRESS] });
        localStorageService.set('fullLocalDestPath', xml.fullLocalDestPath);
        resolve(xml);
      });
      ipcRenderer.once(ipcConsts.DOWNLOAD_UPDATE_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.DOWNLOAD_UPDATE_SUCCESS, ipcConsts.DOWNLOAD_UPDATE_FAILURE, ipcConsts.DOWNLOAD_UPDATE_PROGRESS] });
        localStorageService.clearByKey('fullLocalDestPath');
        reject(args);
      });
    });
  }
}

export default WalletUpdateService;
