import fs from 'fs';
import util from 'util';
import path from 'path';
import os from 'os';
import { app, dialog, shell } from 'electron';
import { ipcConsts } from '../app/vars';

const { exec } = require('child_process');

const readFileAsync = util.promisify(fs.readFile);
const readDirectoryAsync = util.promisify(fs.readdir);
const writeFileAsync = util.promisify(fs.writeFile);
const unlinkFileAsync = util.promisify(fs.unlink);

// Linux: ~/.config/<App Name>
// Mac OS: ~/Library/Application Support/<App Name>
// Windows: C:\Users\<user>\AppData\Local\<App Name>
const appFilesDirPath = app.getPath('userData');
const documentsDirPath = app.getPath('documents');

class FileManager {
  static fileName = '';

  static prevBuffer = '';

  static curBuffer = '';

  static fileWriterInterval = null;

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

  static readFile = async ({ event, filePath }) => {
    await FileManager._readFile({ event, filePath });
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
      await FileManager._writeFile({ filePath, fileContent });
      event.sender.send(ipcConsts.SAVE_FILE_RESPONSE, { error: null });
    } catch (error) {
      event.sender.send(ipcConsts.SAVE_FILE_RESPONSE, { error });
    }
  };

  static updateWalletFile = async ({ fileName, data, immediateUpdate }) => {
    if (FileManager.prevBuffer !== FileManager.curBuffer) {
      FileManager.prevBuffer = FileManager.curBuffer;
    }
    FileManager.curBuffer = data;
    FileManager.fileName = fileName;
    if (immediateUpdate) {
      try {
        await FileManager._writeFile({ filePath: FileManager.fileName, fileContent: JSON.stringify(FileManager.curBuffer) });
      } catch (error) {
        console.log(error); // eslint-disable-line no-console
      }
    }
    if (!FileManager.fileWriterInterval) {
      FileManager.fileWriterInterval = setInterval(async () => {
        if (FileManager.curBuffer !== FileManager.prevBuffer) {
          try {
            await FileManager._writeFile({ filePath: FileManager.fileName, fileContent: JSON.stringify(FileManager.curBuffer) });
          } catch (error) {
            console.log(error); // eslint-disable-line no-console
          }
        }
      }, 1000);
    }
  };

  static cleanUp = async () => {
    clearInterval(FileManager.fileWriterInterval);
    if (FileManager.fileName) {
      try {
        await FileManager._writeFile({ filePath: FileManager.fileName, fileContent: JSON.stringify(FileManager.curBuffer) });
      } catch (error) {
        console.log(error); // eslint-disable-line no-console
      }
    }
  };

  static cleanWalletFile = async () => {
    const files = await readDirectoryAsync(appFilesDirPath);
    const regex = new RegExp('(my_wallet_).*.(json)', 'ig');
    const filteredFiles = files.filter((file) => file.match(regex));
    if (filteredFiles.length) {
      const filesWithPath = filteredFiles.map((file) => path.join(appFilesDirPath, file));
      const fileContent = await readFileAsync(filesWithPath[0]);
      const parsedData = JSON.parse(fileContent);
      parsedData.transactions = [{ layerId: 0, data: [] }];
      await writeFileAsync(filesWithPath[0], JSON.stringify(parsedData));
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
        clearInterval(FileManager.fileWriterInterval);
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
      clearInterval(FileManager.fileWriterInterval);
      browserWindow.destroy();
      const command = os.type() === 'windows' ? `rmdir /q/s '${appFilesDirPath}'` : `rm -rf '${appFilesDirPath}'`;
      exec(command, (error) => {
        if (error) {
          console.error(error); // eslint-disable-line no-console
        }
        console.log('deleted'); // eslint-disable-line no-console
      });
      app.quit();
    }
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

export default FileManager;
