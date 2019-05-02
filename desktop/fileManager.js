import fs from 'fs';
import util from 'util';
import path from 'path';
import { app, dialog, shell } from 'electron';
import { ipcConsts } from '../app/vars';

const readFileAsync = util.promisify(fs.readFile);
const readDirectoryAsync = util.promisify(fs.readdir);
const writeFileAsync = util.promisify(fs.writeFile);

// Linux: ~/.config/<App Name>
// Mac OS: ~/Library/Application Support/<App Name>
// Windows: C:\Users\<user>\AppData\Local\<App Name>
const appFilesDirPath = app.getPath('userData');
const documentsDirPath = app.getPath('documents');

class FileManager {
  static getFileName = ({ browserWindow, event }) => {
    const options = {
      title: 'Load Wallet Backup File',
      defaultPath: documentsDirPath,
      buttonLabel: 'Load',
      filters: [{ name: 'Backup Files', extensions: ['json'] }],
      properties: ['openFile']
    };
    dialog.showOpenDialog(browserWindow, options, async (filePaths) => {
      if (filePaths && filePaths[0]) {
        event.sender.send(ipcConsts.GET_FILE_NAME_SUCCESS, filePaths[0]);
      }
    });
  };

  static openWalletBackupDirectory = async ({ event }) => {
    try {
      const files = await readDirectoryAsync(appFilesDirPath);
      const regex = new RegExp('.*.(json)', 'ig');
      const filteredFiles = files.filter((file) => file.match(regex));
      const filesWithPath = filteredFiles.map((file) => path.join(appFilesDirPath, file));
      if (filesWithPath && filesWithPath[0]) {
        shell.showItemInFolder(filesWithPath[0]);
        event.sender.send(ipcConsts.OPEN_DIRECTORY_SUCCESS);
      } else {
        throw new Error('Wallet backup file not found');
      }
    } catch (error) {
      event.sender.send(ipcConsts.OPEN_DIRECTORY_FAILURE, error.message);
    }
  };

  static readFile = async ({ event, filePath }) => {
    await FileManager._readFile({ event, filePath });
  };

  static readDirectory = async ({ event }) => {
    try {
      const files = await readDirectoryAsync(appFilesDirPath);
      const regex = new RegExp('.*.(json)', 'ig');
      const filteredFiles = files.filter((file) => file.match(regex));
      const filesWithPath = filteredFiles.map((file) => path.join(appFilesDirPath, file));
      event.sender.send(ipcConsts.READ_DIRECTORY_SUCCESS, filesWithPath);
    } catch (error) {
      event.sender.send(ipcConsts.READ_DIRECTORY_FAILURE, error.message);
    }
  };

  static writeFile = async ({ browserWindow, event, fileName, fileContent, showDialog }) => {
    if (showDialog) {
      const options = {
        title: 'Save Wallet Backup File',
        defaultPath: documentsDirPath,
        buttonLabel: 'Save',
        filters: [{ name: 'Backup Files', extensions: ['json'] }]
      };
      dialog.showSaveDialog(browserWindow, options, async (filePath) => {
        if (filePath) {
          await FileManager._writeFile({ event, filePath, fileContent });
        }
      });
    } else {
      const filePath = path.join(appFilesDirPath, fileName);
      await FileManager._writeFile({ event, filePath, fileContent });
    }
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
