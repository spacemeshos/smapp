// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class diskStorageService {
  static getDriveList = () => {
    ipcRenderer.send(ipcConsts.GET_DRIVE_LIST);
    return new Promise<string, Error>((resolve: Function) => {
      ipcRenderer.once(ipcConsts.GET_DRIVE_LIST_RESPONSE, (event, xml) => {
        resolve(xml);
      });
    });
  };
}

export default diskStorageService;
