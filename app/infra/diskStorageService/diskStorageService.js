// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class diskStorageService {
  static getDriveList = () => {
    ipcRenderer.send(ipcConsts.GET_DRIVE_LIST);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_DRIVE_LIST_SUCCESS, (event, xml) => {
        resolve(xml);
      });
      ipcRenderer.once(ipcConsts.GET_DRIVE_LIST_FAILURE, (event, args) => {
        reject(args);
      });
    });
  };
}

export default diskStorageService;
