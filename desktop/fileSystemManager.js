import fs from 'fs';
import util from 'util';
import path from 'path';
import os from 'os';
import { app, dialog, shell } from 'electron';
import { ipcConsts } from '../app/vars';

const { exec } = require('child_process');
const checkDiskSpace = require('check-disk-space');

const readFileAsync = util.promisify(fs.readFile);
const readDirectoryAsync = util.promisify(fs.readdir);
const writeFileAsync = util.promisify(fs.writeFile);
const unlinkFileAsync = util.promisify(fs.unlink);

// Linux: ~/.config/<App Name>
// Mac OS: ~/Library/Application Support/<App Name>
// Windows: C:\Users\<user>\AppData\Local\<App Name>
const appFilesDirPath = app.getPath('userData');
const documentsDirPath = app.getPath('documents');

class FileSystemManager {
  static copyFile = ({ event, fileName, filePath, newFileName, saveToDocumentsFolder }) => {
    const newFilePath = saveToDocumentsFolder ? path.join(documentsDirPath, newFileName) : path.join(appFilesDirPath, fileName);
    fs.copyFile(filePath, newFilePath, (error) => {
      if (error) {
        event.sender.send(ipcConsts.COPY_FILE_RESPONSE, { error });
      }
      event.sender.send(ipcConsts.COPY_FILE_RESPONSE, { error: null, newFilePath });
    });
  };

  static openWalletBackupDirectory = async ({ lastBackupTime }) => {
    try {
      const files = await readDirectoryAsync(lastBackupTime ? documentsDirPath : appFilesDirPath);
      const regex = new RegExp(lastBackupTime || '(my_wallet_).*.(json)', 'ig');
      const filteredFiles = files.filter((file) => file.match(regex));
      const filesWithPath = filteredFiles.map((file) => path.join(lastBackupTime ? documentsDirPath : appFilesDirPath, file));
      if (filesWithPath && filesWithPath[0]) {
        shell.showItemInFolder(filesWithPath[0]);
      } else {
        shell.openItem(appFilesDirPath);
      }
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  };

  static openLogFile = async () => {
    try {
      const logFilePath = path.resolve(app.getPath('userData'), 'spacemesh-log.txt');
      shell.showItemInFolder(logFilePath);
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  };

  static readFile = async ({ event, filePath }) => {
    await FileSystemManager._readFile({ event, filePath });
  };

  static readDirectory = async ({ event }) => {
    try {
      const files = await readDirectoryAsync(appFilesDirPath);
      const regex = new RegExp('(my_wallet_).*.(json)', 'ig');
      const filteredFiles = files.filter((file) => file.match(regex));
      const filesWithPath = filteredFiles.map((file) => path.join(appFilesDirPath, file));
      event.sender.send(ipcConsts.READ_DIRECTORY_RESPONSE, { error: null, filesWithPath });
    } catch (error) {
      event.sender.send(ipcConsts.READ_DIRECTORY_FAILURE, { error, filesWithPath: null });
    }
  };

  static writeFile = async ({ event, fileName, fileContent, saveToDocumentsFolder }) => {
    const filePath = path.join(saveToDocumentsFolder ? documentsDirPath : appFilesDirPath, fileName);
    try {
      await FileSystemManager._writeFile({ filePath, fileContent });
      event.sender.send(ipcConsts.SAVE_FILE_RESPONSE, { error: null });
    } catch (error) {
      event.sender.send(ipcConsts.SAVE_FILE_RESPONSE, { error });
    }
  };

  static updateWalletFile = async ({ fileName, data, field }) => {
    try {
      const rawFileContent = await readFileAsync(fileName);
      const fileContent = JSON.parse(rawFileContent);
      await FileSystemManager._writeFile({ filePath: fileName, fileContent: JSON.stringify({ ...fileContent, [field]: data }) });
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  };

  static deleteWalletFile = async ({ browserWindow, fileName }) => {
    const options = {
      title: 'Delete File',
      message: 'All wallet data will be lost. Are You Sure?',
      buttons: ['Delete Wallet File', 'Cancel']
    };
    const { response } = await dialog.showMessageBox(browserWindow, options);
    if (response === 0) {
      try {
        await unlinkFileAsync(fileName);
        browserWindow.reload();
      } catch (err) {
        console.error('Error deleting wallet file'); // eslint-disable-line no-console
      }
    }
  };

  static wipeOut = async ({ browserWindow }) => {
    const options = {
      type: 'warning',
      title: 'Reinstall App',
      message: 'WARNING: All wallets, addresses and settings will be lost. Are you sure you want to do this?',
      buttons: ['Delete All', 'Cancel']
    };
    const { response } = await dialog.showMessageBox(browserWindow, options);
    if (response === 0) {
      browserWindow.destroy();
      const command = os.type() === 'Windows_NT' ? `rmdir /q/s '${appFilesDirPath}'` : `rm -rf '${appFilesDirPath}'`;
      exec(command, (error) => {
        if (error) {
          console.error(error); // eslint-disable-line no-console
        }
        console.log('deleted'); // eslint-disable-line no-console
      });
      app.quit();
    }
  };

  static selectPostFolder = async ({ event, browserWindow }) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, {
      title: 'Select folder for smeshing',
      defaultPath: documentsDirPath,
      properties: ['openDirectory']
    });
    if (canceled || !filePaths.length) {
      event.sender.send(ipcConsts.SELECT_POST_FOLDER_RESPONSE, { error: 'no folder selected' });
    } else {
      try {
        fs.accessSync(filePaths[0], fs.constants.W_OK);
        const diskSpace = await checkDiskSpace(filePaths[0]);
        event.sender.send(ipcConsts.SELECT_POST_FOLDER_RESPONSE, { selectedFolder: filePaths[0], freeSpace: diskSpace.free });
      } catch (err) {
        event.sender.send(ipcConsts.SELECT_POST_FOLDER_RESPONSE, { error: err });
      }
    }
  };

  static getAudioPath = ({ event }) => {
    const audioPath = path.resolve(app.getAppPath(), process.env.NODE_ENV === 'development' ? '../resources/sounds' : '../../sounds', 'smesh_reward.mp3');
    event.sender.send(ipcConsts.GET_AUDIO_PATH_RESPONSE, { error: null, audioPath });
  };

  static _readFile = async ({ event, filePath }) => {
    try {
      const fileContent = await readFileAsync(filePath);
      event.sender.send(ipcConsts.READ_FILE_RESPONSE, { error: null, xml: JSON.parse(fileContent) });
    } catch (error) {
      event.sender.send(ipcConsts.READ_FILE_RESPONSE, { error, xml: null });
    }
  };

  static _writeFile = async ({ filePath, fileContent }) => {
    await writeFileAsync(filePath, fileContent);
  };
}

export default FileSystemManager;
