// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { listenerCleanup } from '/infra/utils';

class diskStorageService {
  static getDriveList = () => {
    ipcRenderer.send(ipcConsts.GET_DRIVE_LIST);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_DRIVE_LIST_SUCCESS, (event, xml) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_DRIVE_LIST_SUCCESS, ipcConsts.GET_DRIVE_LIST_FAILURE] });
        resolve(xml);
      });
      ipcRenderer.once(ipcConsts.GET_DRIVE_LIST_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_DRIVE_LIST_SUCCESS, ipcConsts.GET_DRIVE_LIST_FAILURE] });
        reject(args);
      });
    });
  };
}

export default diskStorageService;
