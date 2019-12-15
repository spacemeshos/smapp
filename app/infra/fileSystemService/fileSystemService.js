// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class FsService {
  static copyFile = ({ fileName, filePath }: { fileName: string, filePath: string }) => {
    ipcRenderer.send(ipcConsts.COPY_FILE, { fileName, filePath });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.COPY_FILE_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.newFilePath);
      });
    });
  };

  static readFile = ({ filePath }: { filePath: string }) => {
    ipcRenderer.send(ipcConsts.READ_FILE, { filePath });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.READ_FILE_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.xml);
      });
    });
  };

  static readDirectory = () => {
    ipcRenderer.send(ipcConsts.READ_DIRECTORY);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.READ_DIRECTORY_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.filesWithPath);
      });
    });
  };

  static saveFile = ({ fileName, fileContent, saveToDocumentsFolder }: { fileName: string, fileContent: string, saveToDocumentsFolder: boolean }) => {
    ipcRenderer.send(ipcConsts.SAVE_FILE, { fileName, fileContent, saveToDocumentsFolder });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SAVE_FILE_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve();
      });
    });
  };

  static updateFile = ({ fileName, fieldName, data }: { fileName: string, fieldName: string, data: string }) => {
    ipcRenderer.send(ipcConsts.UPDATE_FILE, { fileName, fieldName, data });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.UPDATE_FILE_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve();
      });
    });
  };

  static openWalletBackupDirectory = ({ lastBackupTime }: { lastBackupTime?: string }) => {
    ipcRenderer.send(ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY, { lastBackupTime });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve();
      });
    });
  };

  static deleteWalletFile = ({ fileName }: { fileName: string }) => {
    ipcRenderer.send(ipcConsts.DELETE_FILE, { fileName });
  };

  static wipeOut = () => {
    ipcRenderer.send(ipcConsts.WIPE_OUT);
  };
}

export default FsService;
