// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class FsService {
  static copyFile = ({ fileName, filePath, newFileName, saveToDocumentsFolder }: { fileName: string, filePath: string, newFileName: string, saveToDocumentsFolder: boolean }) => {
    ipcRenderer.send(ipcConsts.COPY_FILE, { fileName, filePath, newFileName, saveToDocumentsFolder });
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

  static updateWalletFile = ({ fileName, data, immediateUpdate }: { fileName: string, data: Object, immediateUpdate?: boolean }) => {
    ipcRenderer.send(ipcConsts.UPDATE_WALLET_FILE, { fileName, data, immediateUpdate });
  };

  static openWalletBackupDirectory = ({ lastBackupTime }: { lastBackupTime?: string }) => {
    ipcRenderer.send(ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY, { lastBackupTime });
  };

  static openLogFile = () => {
    ipcRenderer.send(ipcConsts.OPEN_LOG_FILE);
  };

  static deleteWalletFile = ({ fileName }: { fileName: string }) => {
    ipcRenderer.send(ipcConsts.DELETE_FILE, { fileName });
  };

  static wipeOut = () => {
    ipcRenderer.send(ipcConsts.WIPE_OUT);
  };

  static selectPostFolder = () => {
    ipcRenderer.send(ipcConsts.SELECT_POST_FOLDER);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SELECT_POST_FOLDER_RESPONSE, (event, response) => {
        if (response.error) {
          reject({ error: response.error }); // eslint-disable-line prefer-promise-reject-errors
        }
        resolve({ selectedFolder: response.selectedFolder, freeSpace: response.freeSpace });
      });
    });
  };

  static getAudioPath = () => {
    ipcRenderer.send(ipcConsts.GET_AUDIO_PATH);
    return new Promise<string, Error>((resolve: Function) => {
      ipcRenderer.once(ipcConsts.GET_AUDIO_PATH_RESPONSE, (event, response) => {
        resolve(response.audioPath);
      });
    });
  };
}

export default FsService;
