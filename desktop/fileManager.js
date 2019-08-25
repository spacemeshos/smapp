import fs from 'fs';
import util from 'util';
import path from 'path';
import os from 'os';
import { app, dialog, shell } from 'electron';
import { ipcConsts } from '../app/vars';

const child = require('child_process').execFile;

const readFileAsync = util.promisify(fs.readFile);
const readDirectoryAsync = util.promisify(fs.readdir);
const writeFileAsync = util.promisify(fs.writeFile);

// Linux: ~/.config/<App Name>
// Mac OS: ~/Library/Application Support/<App Name>
// Windows: C:\Users\<user>\AppData\Local\<App Name>
const appFilesDirPath = app.getPath('userData');
const documentsDirPath = app.getPath('documents');

const getOsTarget = (): 'mac' | 'linux' | 'windows' => {
  switch (os.type()) {
    case 'Darwin':
      return 'mac';
    case 'Linux':
      return 'linux';
    case 'Windows_NT':
      return 'windows';
    default:
      throw new Error('Could not get OS target name.');
  }
};

class FileManager {
  static copyFile = ({ event, fileName, filePath }) => {
    const newFilePath = path.join(appFilesDirPath, fileName);
    fs.copyFile(filePath, newFilePath, (err) => {
      if (err) {
        event.sender.send(ipcConsts.COPY_FILE_SUCCESS);
      }
      event.sender.send(ipcConsts.COPY_FILE_SUCCESS, newFilePath);
    });
  };

  static openWalletBackupDirectory = async ({ event, lastBackupTime }) => {
    try {
      const files = await readDirectoryAsync(lastBackupTime ? documentsDirPath : appFilesDirPath);
      const regex = new RegExp(lastBackupTime || '.*.(json)', 'ig');
      const filteredFiles = files.filter((file) => file.match(regex));
      const filesWithPath = filteredFiles.map((file) => path.join(lastBackupTime ? documentsDirPath : appFilesDirPath, file));
      if (filesWithPath && filesWithPath[0]) {
        shell.showItemInFolder(filesWithPath[0]);
      } else {
        shell.openItem(appFilesDirPath);
      }
      event.sender.send(ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY_SUCCESS);
    } catch (error) {
      event.sender.send(ipcConsts.OPEN_WALLET_BACKUP_DIRECTORY_FAILURE, error.message);
    }
  };

  static readFile = async ({ event, filePath }) => {
    await FileManager._readFile({ event, filePath });
  };

  static readDirectory = async ({ event }) => {
    try {
      const files = await readDirectoryAsync(appFilesDirPath);
      const regex = new RegExp('(my_wallet_).*.(json)', 'ig');
      const filteredFiles = files.filter((file) => file.match(regex));
      const filesWithPath = filteredFiles.map((file) => path.join(appFilesDirPath, file));
      event.sender.send(ipcConsts.READ_DIRECTORY_SUCCESS, filesWithPath);
    } catch (error) {
      event.sender.send(ipcConsts.READ_DIRECTORY_FAILURE, error.message);
    }
  };

  static writeFile = async ({ event, fileName, fileContent, saveToDocumentsFolder }) => {
    const filePath = path.join(saveToDocumentsFolder ? documentsDirPath : appFilesDirPath, fileName);
    await FileManager._writeFile({ event, filePath, fileContent });
  };

  static updateFile = async ({ event, fileName, fieldName, data }) => {
    try {
      const filePath = path.isAbsolute(fileName) ? fileName : path.join(appFilesDirPath, fileName);
      const fileContent = await readFileAsync(filePath);
      const file = JSON.parse(fileContent);
      file[fieldName] = data;
      await writeFileAsync(filePath, JSON.stringify(file));
      event.sender.send(ipcConsts.UPDATE_FILE_SUCCESS);
    } catch (error) {
      event.sender.send(ipcConsts.UPDATE_FILE_FAILURE, error.message);
    }
  };

  static deleteWalletFile = ({ browserWindow, fileName }) => {
    try {
      const filePath = path.isAbsolute(fileName) ? fileName : path.join(appFilesDirPath, fileName);
      const options = {
        title: 'Delete File',
        message: 'All wallet data will be lost. Are You Sure?',
        buttons: ['Delete Wallet File', 'Cancel']
      };
      dialog.showMessageBox(browserWindow, options, (response) => {
        if (response === 0) {
          fs.unlink(filePath, (err) => {
            if (err) {
              throw err;
            }
          });
          browserWindow.reload();
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting wallet file');
    }
  };

  static startNode = async ({ event }) => {
    const isDevMode = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
    const osTarget = getOsTarget();
    const devPath = './miniMesh.sh';
    // TODO: should change prodPath to actual executable file path in prod.
    const prodPath = path.resolve(`${process.resourcesPath}/../node/${osTarget}/${osTarget === 'windows' ? '' : osTarget}go-spacemesh${osTarget === 'windows' ? '.exe' : ''}`);
    const executablePath = isDevMode ? devPath : prodPath;
    child(executablePath, (err) => {
      if (err) {
        event.sender.send(ipcConsts.START_NODE_FAILURE, err.message);
      }
      event.sender.send(ipcConsts.START_NODE_SUCCESS);
    });
  };

  static _readFile = async ({ event, filePath }) => {
    try {
      const fileContent = await readFileAsync(filePath);
      event.sender.send(ipcConsts.READ_FILE_SUCCESS, JSON.parse(fileContent));
    } catch (error) {
      event.sender.send(ipcConsts.READ_FILE_FAILURE, error.message);
    }
  };

  static _writeFile = async ({ event, filePath, fileContent }) => {
    try {
      await writeFileAsync(filePath, fileContent);
      event.sender.send(ipcConsts.SAVE_FILE_SUCCESS);
    } catch (error) {
      event.sender.send(ipcConsts.SAVE_FILE_FAILURE, error.message);
    }
  };
}

export default FileManager;
