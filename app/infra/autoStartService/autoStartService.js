// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { listenerCleanup } from '/infra/utils';

class AutoStartService {
  static isAutoStartEnabled() {
    ipcRenderer.send(ipcConsts.IS_AUTO_START_ENABLED_REQUEST);
    return new Promise<string, Error>((resolve: Function) => {
      ipcRenderer.once(ipcConsts.IS_AUTO_START_ENABLED_REQUEST_RESPONSE, (event, res) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.IS_AUTO_START_ENABLED_REQUEST_RESPONSE] });
        resolve(res);
      });
    });
  }

  static toggleAutoStart() {
    ipcRenderer.send(ipcConsts.TOGGLE_AUTO_START);
  }
}

export default AutoStartService;
