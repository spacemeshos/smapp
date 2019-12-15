// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class AutoStartService {
  static isAutoStartEnabled() {
    ipcRenderer.send(ipcConsts.IS_AUTO_START_ENABLED_REQUEST);
    return new Promise<string, Error>((resolve: Function) => {
      ipcRenderer.once(ipcConsts.IS_AUTO_START_ENABLED_REQUEST_RESPONSE, (event, res) => {
        resolve(res);
      });
    });
  }

  static toggleAutoStart() {
    ipcRenderer.send(ipcConsts.TOGGLE_AUTO_START);
  }
}

export default AutoStartService;
