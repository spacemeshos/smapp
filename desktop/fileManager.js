import fs from 'fs';
import util from 'util';
import path from 'path';
import { app, dialog, shell } from 'electron';
import { ipcConsts } from '../app/vars';
import { asyncForEach } from '../app/infra/utils';

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
        await FileManager._writeFile({ filePath: FileManager.fileName, fileContent: FileManager.curBuffer });
      } catch (error) {
        console.log(error); // eslint-disable-line no-console
      }
    }
    if (!FileManager.fileWriterInterval) {
      FileManager.fileWriterInterval = setInterval(async () => {
        if (FileManager.curBuffer !== FileManager.prevBuffer) {
          try {
            await FileManager._writeFile({ filePath: FileManager.fileName, fileContent: FileManager.curBuffer });
          } catch (error) {
            console.log(error); // eslint-disable-line no-console
          }
        }
      }, 1000);
    }
  };

  static cleanUp = async () => {
    clearInterval(FileManager.fileWriterInterval);
    try {
      if (FileManager.fileName) {
        await FileManager._writeFile({ filePath: FileManager.fileName, fileContent: FileManager.curBuffer });
      }
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  };

  static deleteWalletFile = ({ browserWindow, fileName }) => {
    try {
      const options = {
        title: 'Delete File',
        message: 'All wallet data will be lost. Are You Sure?',
        buttons: ['Delete Wallet File', 'Cancel']
      };
      dialog.showMessageBox(browserWindow, options, async (response) => {
        if (response === 0) {
          try {
            await unlinkFileAsync(fileName);
            browserWindow.reload();
          } catch (err) {
            throw new Error(err);
          }
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting wallet file');
    }
  };

  static wipeOut = ({ browserWindow }) => {
    try {
      const options = {
        title: 'Reinstall App',
        message: 'WARNING: All wallets, addresses and settings will be lost. Are you sure you want to do this?',
        buttons: ['Delete All', 'Cancel']
      };
      dialog.showMessageBox(browserWindow, options, async (response) => {
        if (response === 0) {
          const deleteFolderRecursive = (path) => {
            if (fs.existsSync(path)) {
              fs.readdirSync(path).forEach((file) => {
                const curPath = `${path}/${file}`;
                if (fs.lstatSync(curPath).isDirectory()) {
                  // recurse
                  deleteFolderRecursive(curPath);
                } else {
                  // delete file
                  fs.unlinkSync(curPath);
                }
              });
              fs.rmdirSync(path);
            }
          };
          deleteFolderRecursive(appFilesDirPath);
          app.exit();
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error purging app data directory');
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
