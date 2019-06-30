// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { listenerCleanup } from '/infra/utils';

class FsService {
  static getFileName = () => {
    ipcRenderer.send(ipcConsts.GET_FILE_NAME);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_FILE_NAME_SUCCESS, (event, xml) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_FILE_NAME_SUCCESS, ipcConsts.GET_FILE_NAME_FAILURE] });
        resolve(xml);
      });
      ipcRenderer.once(ipcConsts.GET_FILE_NAME_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_FILE_NAME_SUCCESS, ipcConsts.GET_FILE_NAME_FAILURE] });
        reject(args);
      });
    });
  };

  static readFile = ({ filePath }: { filePath: string }) => {
    ipcRenderer.send(ipcConsts.READ_FILE, { filePath });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.READ_FILE_SUCCESS, (event, xml) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.READ_FILE_SUCCESS, ipcConsts.READ_FILE_FAILURE] });
        resolve(xml);
      });
      ipcRenderer.once(ipcConsts.READ_FILE_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.READ_FILE_SUCCESS, ipcConsts.READ_FILE_FAILURE] });
        reject(args);
      });
    });
  };

  static readDirectory = () => {
    ipcRenderer.send(ipcConsts.READ_DIRECTORY);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.READ_DIRECTORY_SUCCESS, (event, xml) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.READ_DIRECTORY_SUCCESS, ipcConsts.READ_DIRECTORY_FAILURE] });
        resolve(xml);
      });
      ipcRenderer.once(ipcConsts.READ_DIRECTORY_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.READ_DIRECTORY_SUCCESS, ipcConsts.READ_DIRECTORY_FAILURE] });
        reject(args);
      });
    });
  };

  static saveFile = ({ fileName, fileContent, showDialog }: { fileName: string, fileContent: string, showDialog: string }) => {
    ipcRenderer.send(ipcConsts.SAVE_FILE, { fileName, fileContent, showDialog });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SAVE_FILE_SUCCESS, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.SAVE_FILE_SUCCESS, ipcConsts.SAVE_FILE_FAILURE] });
        resolve();
      });
      ipcRenderer.once(ipcConsts.SAVE_FILE_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.SAVE_FILE_SUCCESS, ipcConsts.SAVE_FILE_FAILURE] });
        reject(args);
      });
    });
  };

  static updateFile = ({ fileName, fieldName, data }: { fileName: string, fieldName: string, data: string }) => {
    ipcRenderer.send(ipcConsts.UPDATE_FILE, { fileName, fieldName, data });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.UPDATE_FILE_SUCCESS, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.UPDATE_FILE_SUCCESS, ipcConsts.UPDATE_FILE_FAILURE] });
        resolve();
      });
      ipcRenderer.once(ipcConsts.UPDATE_FILE_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.UPDATE_FILE_SUCCESS, ipcConsts.UPDATE_FILE_FAILURE] });
        reject(args);
      });
    });
  };

  static openWalletBackupDirectory = () => {
    ipcRenderer.send(ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY_SUCCESS, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY_SUCCESS, ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY_FAILURE] });
        resolve();
      });
      ipcRenderer.once(ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY_SUCCESS, ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY_FAILURE] });
        reject(args);
      });
    });
  };

  static deleteWalletFile = ({ fileName }: { fileName: string }) => {
    ipcRenderer.send(ipcConsts.DELETE_FILE, { fileName });
  };

  static runLocalNode = () => {
    ipcRenderer.send(ipcConsts.RUN_EXEC_FILE);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.RUN_EXEC_FILE_SUCCESS, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.RUN_EXEC_FILE_SUCCESS, ipcConsts.RUN_EXEC_FILE_FAILURE] });
        resolve();
      });
      ipcRenderer.once(ipcConsts.RUN_EXEC_FILE_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.RUN_EXEC_FILE_SUCCESS, ipcConsts.RUN_EXEC_FILE_FAILURE] });
        reject(args);
      });
    });
  };
}

export default FsService;
