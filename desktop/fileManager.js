import fs from 'fs';
import util from 'util';
import path from 'path';
import { app, dialog } from 'electron';
import { ipcConsts } from '../app/vars';

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Linux: ~/.config/<App Name>
// Mac OS: ~/Library/Application Support/<App Name>
// Windows: C:\Users\<user>\AppData\Local\<App Name>
const appFilesDirPath = app.getPath('userData');
const documentsDirPath = app.getPath('documents');

class FileManager {
  static readFile = async ({ browserWindow, event, filePath, showDialog }) => {
    if (showDialog) {
      const options = {
        title: 'Load Wallet Backup File',
        defaultPath: documentsDirPath,
        buttonLabel: 'Load',
        filters: [{ name: 'Backup Files', extensions: ['json'] }],
        properties: ['openFile']
      };
      dialog.showOpenDialog(browserWindow, options, async (filePaths) => {
        if (filePaths && filePaths[0]) {
          await FileManager._readFile({ event, path: filePaths[0] });
        }
      });
    } else {
      await FileManager._readFile({ event, path: filePath });
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

  static _readFile = async ({ event, path }) => {
    try {
      const fileContent = await readFileAsync(path);
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
