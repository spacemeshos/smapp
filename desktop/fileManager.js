import fs from 'fs';
import util from 'util';
import path from 'path';
import https from 'https';
import os from 'os';
import { app, dialog, shell } from 'electron';
import { ipcConsts } from '../app/vars';

const readFileAsync = util.promisify(fs.readFile);
const readDirectoryAsync = util.promisify(fs.readdir);
const writeFileAsync = util.promisify(fs.writeFile);
const unlinkFileAsync = util.promisify(fs.unlink);

// Linux: ~/.config/<App Name>
// Mac OS: ~/Library/Application Support/<App Name>
// Windows: C:\Users\<user>\AppData\Local\<App Name>
const appFilesDirPath = app.getPath('userData');
const documentsDirPath = app.getPath('documents');
const downloadsDirPath = app.getPath('downloads');

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
      const regex = new RegExp(lastBackupTime || '(my_wallet_).*.(json)', 'ig');
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

  static openDownloadsDirectory = async ({ event }) => {
    try {
      const files = await readDirectoryAsync(downloadsDirPath);
      let fileSuffix: string;
      switch (os.type()) {
        case 'Linux':
          fileSuffix = 'AppImage';
          break;
        case 'Windows_NT':
          fileSuffix = 'exe';
          break;
        case 'Darwin':
        default:
          fileSuffix = 'dmg';
          break;
      }
      const regex = new RegExp(`(Spacemesh).*.(${fileSuffix})`, 'ig');
      const filteredFiles = files.filter((file) => file.match(regex));
      const filesWithPath = filteredFiles.map((file) => path.join(downloadsDirPath, file));
      if (filesWithPath && filesWithPath[0]) {
        shell.showItemInFolder(filesWithPath[0]);
      } else {
        shell.openItem(downloadsDirPath);
      }
      event.sender.send(ipcConsts.OPEN_DOWNLOADS_DIRECTORY_SUCCESS);
    } catch (error) {
      event.sender.send(ipcConsts.OPEN_DOWNLOADS_DIRECTORY_FAILURE, error.message);
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

  static downloadUpdate = async ({ event, walletUpdatePath }) => {
    try {
      const fileName = walletUpdatePath.split('/').pop();
      const fullLocalDestPath = path.join(downloadsDirPath, fileName);
      const file = fs.createWriteStream(fullLocalDestPath);
      let receivedBytes: number = 0;
      const request = https.get(walletUpdatePath, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          event.sender.send(ipcConsts.DOWNLOAD_UPDATE_SUCCESS, { fullLocalDestPath });
        });
        response.on('data', function(chunk) {
          receivedBytes += chunk.length;
          const totalBytes: number = response.headers && parseInt(response.headers['content-length']);
          event.sender.send(ipcConsts.DOWNLOAD_UPDATE_PROGRESS, { receivedBytes, totalBytes });
        });
        file.on('error', () => {
          fs.unlink(fullLocalDestPath);
          throw new Error('File Error!');
        });
      });
      request.on('error', () => {
        fs.unlink(fullLocalDestPath);
        throw new Error('Request Error!');
      });
    } catch (error) {
      event.sender.send(ipcConsts.DOWNLOAD_UPDATE_FAILURE, error.message);
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
      dialog.showMessageBox(browserWindow, options, async (response) => {
        if (response === 0) {
          try {
            await unlinkFileAsync(filePath);
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
