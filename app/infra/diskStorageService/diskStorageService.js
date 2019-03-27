// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

const getBytesfromGb = (Gb: number) => Gb * 1073741824;
const LEAVE_AVAILABLE_SPACE = 50; // GB

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

  static getAvailableDiskSpace = ({ path }: { path: string }) => {
    ipcRenderer.send(ipcConsts.GET_AVAILABLE_DISK_SPACE, { path });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_AVAILABLE_DISK_SPACE_SUCCESS, (event, availableSpace) => {
        resolve(availableSpace - getBytesfromGb(LEAVE_AVAILABLE_SPACE));
      });
      ipcRenderer.once(ipcConsts.GET_AVAILABLE_DISK_SPACE_FAILURE, (event, args) => {
        reject(args);
      });
    });
  };
}

export default diskStorageService;
