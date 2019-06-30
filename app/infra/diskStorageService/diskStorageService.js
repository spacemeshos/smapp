// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { listenerCleanup } from '/infra/utils';

class diskStorageService {
  static getDriveList = () => {
    ipcRenderer.send(ipcConsts.GET_DRIVE_LIST);
    return new Promise<string, Error>((resolve: Function) => {
      ipcRenderer.once(ipcConsts.GET_DRIVE_LIST_SUCCESS, (event, xml) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_DRIVE_LIST_SUCCESS] });
        resolve(xml);
      });
    });
  };
}

export default diskStorageService;
