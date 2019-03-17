// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class FsService {
  static readFile = ({ fileName, showDialog }: { fileName: string, showDialog: string }) => {
    ipcRenderer.send(ipcConsts.READ_FILE, { fileName, showDialog });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.READ_FILE_SUCCESS, (event, xml) => {
        resolve(xml);
      });
      ipcRenderer.once(ipcConsts.READ_FILE_FAILURE, (event, args) => {
        reject(args);
      });
    });
  };

  static readDirectory = () => {
    ipcRenderer.send(ipcConsts.READ_DIRECTORY);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.READ_DIRECTORY_SUCCESS, (event, xml) => {
        resolve(xml);
      });
      ipcRenderer.once(ipcConsts.READ_DIRECTORY_FAILURE, (event, args) => {
        reject(args);
      });
    });
  };

  static saveFile = ({ fileName, fileContent, showDialog }: { fileName: string, fileContent: string, showDialog: string }) => {
    ipcRenderer.send(ipcConsts.SAVE_FILE, { fileName, fileContent, showDialog });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SAVE_FILE_SUCCESS, () => {
        resolve();
      });
      ipcRenderer.once(ipcConsts.SAVE_FILE_FAILURE, (event, args) => {
        reject(args);
      });
    });
  };
}

export default FsService;
