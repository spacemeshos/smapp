// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { notificationsService } from '/infra/notificationsService';

class WalletUpdateService {
  static checkForWalletUpdate() {
    ipcRenderer.send(ipcConsts.CHECK_WALLET_UPDATE);
  }

  static listenToUpdaterError({ onUpdaterError }: { onUpdaterError: () => void }) {
    ipcRenderer.once(ipcConsts.WALLET_UPDATE_ERROR, () => {
      [ipcConsts.DOWNLOAD_UPDATE_PROGRESS, ipcConsts.DOWNLOAD_UPDATE_COMPLETED].forEach((channel) => {
        ipcRenderer.removeAllListeners(channel);
      });
      onUpdaterError();
    });
  }

  static listenToDownloadUpdate({ onDownloadUpdateCompleted, onDownloadProgress }: { onDownloadUpdateCompleted: () => void, onDownloadProgress: () => void }) {
    ipcRenderer.on(ipcConsts.DOWNLOAD_UPDATE_PROGRESS, () => {
      onDownloadProgress();
    });
    ipcRenderer.on(ipcConsts.DOWNLOAD_UPDATE_COMPLETED, () => {
      notificationsService.notify({
        title: 'Spacemesh',
        notification: 'An important update is available.'
      });
      onDownloadUpdateCompleted();
    });
  }

  static quitAppAndInstallUpdate() {
    ipcRenderer.send(ipcConsts.QUIT_AND_UPDATE);
  }
}

export default WalletUpdateService;
