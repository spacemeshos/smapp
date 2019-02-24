// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '../../vars';

class FsService {
  static readFile({ defaultFilePath }: { defaultFilePath: string }) {
    ipcRenderer.send(ipcConsts.READ_FILE, { defaultFilePath });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.READ_FILE_SUCCESS, (event, xml) => {
        resolve(xml);
      });
      ipcRenderer.once(ipcConsts.READ_FILE_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }

  static saveFile({ defaultFilePath, fileContent }: { defaultFilePath: string, fileContent: string }) {
    ipcRenderer.send(ipcConsts.SAVE_FILE, { defaultFilePath, fileContent });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SAVE_FILE_SUCCESS, () => {
        resolve();
      });
      ipcRenderer.once(ipcConsts.SAVE_FILE_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }
}

export default FsService;
