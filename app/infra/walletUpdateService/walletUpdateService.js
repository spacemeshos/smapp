// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { listenerCleanup } from '/infra/utils';
import { notificationsService } from '/infra/notificationsService';

class WalletUpdateService {
  static checkForWalletUpdate() {
    ipcRenderer.send(ipcConsts.CHECK_WALLET_UPDATE);
    return new Promise<string, Error>((resolve: Function) => {
      ipcRenderer.once(ipcConsts.CHECK_WALLET_UPDATE_SUCCESS, (event, xml) => {
        const { isUpdateAvailable }: { isUpdateAvailable: boolean } = xml;
        isUpdateAvailable &&
          notificationsService.notify({
            title: 'Spacemesh',
            notification: 'An important update is available. Downloading in the background.'
          });
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.CHECK_WALLET_UPDATE_SUCCESS] });
        resolve(xml);
      });
    });
  }

  static listenToUpdaterError({ onUpdaterError }: { onUpdaterError: () => void }) {
    ipcRenderer.once(ipcConsts.WALLET_UPDATE_ERROR, () => {
      listenerCleanup({ ipcRenderer, channels: [ipcConsts.CHECK_WALLET_UPDATE_SUCCESS, ipcConsts.WALLET_UPDATE_ERROR, ipcConsts.DOWNLOAD_UPDATE_COMPLETED] });
      onUpdaterError();
    });
  }

  static listenToDownloadUpdate({ onDownloadUpdateCompleted }: { onDownloadUpdateCompleted: () => void }) {
    ipcRenderer.once(ipcConsts.DOWNLOAD_UPDATE_COMPLETED, () => {
      listenerCleanup({ ipcRenderer, channels: [ipcConsts.DOWNLOAD_UPDATE_COMPLETED] });
      notificationsService.notify({
        title: 'Spacemesh',
        notification: 'App update downloaded.'
      });
      onDownloadUpdateCompleted();
    });
  }

  static quitAppAndInstallUpdate() {
    ipcRenderer.send(ipcConsts.QUIT_AND_UPDATE);
  }
}

export default WalletUpdateService;
