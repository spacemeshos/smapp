import fs from 'fs';
import util from 'util';
import path from 'path';
import os from 'os';
import { app, dialog, shell, ipcMain } from 'electron';
import { ipcConsts } from '../app/vars';
import TransactionManager from './transactionManager';
import StoreService from './storeService';
import netService from './netService';
import FileEncryptionService from './fileEncryptionService';
import encryptionConst from './encryptionConst';

const readFileAsync = util.promisify(fs.readFile);
const readDirectoryAsync = util.promisify(fs.readdir);
const writeFileAsync = util.promisify(fs.writeFile);
const copyFileAsync = util.promisify(fs.copyFile);
const unlinkFileAsync = util.promisify(fs.unlink);

const { exec } = require('child_process');

// Linux: ~/.config/<App Name>
// Mac OS: ~/Library/Application Support/<App Name>
// Windows: C:\Users\<user>\AppData\Local\<App Name>
const appFilesDirPath = app.getPath('userData');
const documentsDirPath = app.getPath('documents');

class WalletManager {
  constructor(mainWindow) {
    this.subscribeToEvents(mainWindow);
    this.txManager = new TransactionManager();
  }

  subscribeToEvents = (mainWindow) => {
    ipcMain.handle(ipcConsts.CREATE_WALLET_FILE, async (event, request) => {
      const res = await this.createWalletFile({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.READ_WALLET_FILES, async () => {
      const res = await this.readWalletFiles();
      return res;
    });
    ipcMain.handle(ipcConsts.UNLOCK_WALLET_FILE, async (event, request) => {
      const res = await this.unlockWalletFile({ ...request });
      return res;
    });
    ipcMain.on(ipcConsts.UPDATE_WALLET_FILE, async (event, request) => {
      await this.updateWalletFile({ ...request });
    });
    ipcMain.handle(ipcConsts.COPY_FILE, async (event, request) => {
      const res = await this.copyFile({ ...request });
      return res;
    });
    ipcMain.on(ipcConsts.SHOW_FILE_IN_FOLDER, (event, request) => {
      this.showFileInDirectory({ ...request });
    });
    ipcMain.on(ipcConsts.DELETE_FILE, async (event, request) => {
      await this.deleteWalletFile({ browserWindow: mainWindow, ...request });
    });
    ipcMain.on(ipcConsts.WIPE_OUT, async () => {
      await this.wipeOut({ browserWindow: mainWindow });
    });

    ipcMain.handle(ipcConsts.GET_BALANCE, async (event, request) => {
      const res = await this.getBalance({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.GET_NONCE, async (event, request) => {
      const res = await this.getNonce({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.SEND_TX, async (event, request) => {
      const res = await this.txManager.sendTx({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.UPDATE_TX, async (event, request) => {
      const res = await this.txManager.updateTransaction({ event, ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.GET_ACCOUNT_TXS, async () => {
      const res = await this.txManager.getAccountTxs();
      return res;
    });
    ipcMain.handle(ipcConsts.GET_ACCOUNT_REWARDS, async (event, request) => {
      const res = await this.txManager.getAccountRewards({ ...request });
      return res;
    });
  };

  createWalletFile = async ({ timestamp, dataToEncrypt, password }) => {
    try {
      const walletNumber = StoreService.get({ key: 'walletNumber' }) || 0;
      const meta = {
        displayName: walletNumber > 0 ? `Wallet ${walletNumber}` : 'Main Wallet',
        created: timestamp,
        netId: 0,
        meta: { salt: encryptionConst.DEFAULT_SALT }
      };
      this.txManager.setAccounts({ accounts: dataToEncrypt.accounts });
      const key = FileEncryptionService.createEncryptionKey({ password });
      const encryptedAccountsData = FileEncryptionService.encryptData({ data: JSON.stringify(dataToEncrypt), key });
      const fileContent = {
        meta,
        crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData },
        contacts: []
      };
      const fileName = `my_wallet_${walletNumber}_${timestamp}.json`;
      const fileNameWithPath = path.resolve(appFilesDirPath, fileName);
      await writeFileAsync(fileNameWithPath, JSON.stringify(fileContent));
      StoreService.set({ key: 'walletNumber', value: walletNumber + 1 });
      return { error: null, meta };
    } catch (error) {
      return { error, meta: null };
    }
  };

  readWalletFiles = async () => {
    try {
      const files = await readDirectoryAsync(appFilesDirPath);
      const regex = new RegExp('(my_wallet_).*.(json)', 'ig');
      const filteredFiles = files.filter((file) => file.match(regex));
      const filesWithPath = filteredFiles.map((file) => path.join(appFilesDirPath, file));
      return { error: null, files: filesWithPath };
    } catch (error) {
      return { error, files: null };
    }
  };

  unlockWalletFile = async ({ path, password }) => {
    try {
      const fileContent = await readFileAsync(path);
      const { crypto, meta, contacts } = JSON.parse(fileContent);
      const key = FileEncryptionService.createEncryptionKey({ password });
      const decryptedDataJSON = FileEncryptionService.decryptData({ data: crypto.cipherText, key });
      const { accounts, mnemonic } = JSON.parse(decryptedDataJSON);
      this.txManager.setAccounts({ accounts });
      return { error: null, accounts, mnemonic, meta, contacts };
    } catch (error) {
      return { error, accounts: null, mnemonic: null, meta: null, contacts: null };
    }
  };

  getBalance = async ({ address }) => {
    try {
      const { value } = await netService.getBalance({ address });
      return { error: null, balance: value };
    } catch (error) {
      if (typeof error.message === 'string' && error.message.includes('account does not exist')) {
        return { error: null, balance: 0 };
      } else {
        return { error, balance: null };
      }
    }
  };

  getNonce = async ({ address }) => {
    try {
      const { value } = await netService.getNonce({ address });
      return { error: null, nonce: value };
    } catch (error) {
      return { error, nonce: null };
    }
  };

  updateWalletFile = async ({ fileName, password, data }) => {
    try {
      const rawFileContent = await readFileAsync(fileName);
      const fileContent = JSON.parse(rawFileContent);
      let field = 'meta';
      let dataToUpdate = data;
      if (password) {
        field = 'crypto';
        const key = FileEncryptionService.createEncryptionKey({ password });
        const encryptedAccountsData = FileEncryptionService.encryptData({ data: JSON.stringify(data), key });
        dataToUpdate = { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData };
        this.txManager.addAccount({ account: data.accounts });
      }
      await writeFileAsync({ filePath: fileName, fileContent: JSON.stringify({ ...fileContent, [field]: dataToUpdate }) });
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  };

  copyFile = async ({ filePath, copyToDocuments }) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const walletNumber = StoreService.get({ key: 'walletNumber' });
    const fileName = copyToDocuments ? `Wallet_Backup_${timestamp}.json` : `my_wallet_${walletNumber}-${new Date().toISOString().replace(/:/, '-')}.json`;
    const newFilePath = copyToDocuments ? path.join(documentsDirPath, fileName) : path.join(appFilesDirPath, fileName);
    try {
      await copyFileAsync(filePath, newFilePath);
      StoreService.set({ key: 'walletNumber', value: walletNumber + 1 });
      return { error: null, newFilePath };
    } catch (error) {
      return { error };
    }
  };

  showFileInDirectory = async ({ isBackupFile, isLogFile }) => {
    if (isBackupFile) {
      try {
        const files = await readDirectoryAsync(documentsDirPath);
        const regex = new RegExp('(Wallet_Backup_).*.(json)', 'ig');
        const filteredFiles = files.filter((file) => file.match(regex));
        const filesWithPath = filteredFiles.map((file) => path.join(documentsDirPath, file));
        if (filesWithPath && filesWithPath[0]) {
          shell.showItemInFolder(filesWithPath[0]);
        } else {
          shell.openItem(documentsDirPath);
        }
      } catch (error) {
        console.log(error); // eslint-disable-line no-console
      }
    } else if (isLogFile) {
      const logFilePath = path.resolve(appFilesDirPath, 'spacemesh-log.txt');
      shell.showItemInFolder(logFilePath);
    } else {
      shell.openItem(appFilesDirPath);
    }
  };

  deleteWalletFile = async ({ browserWindow, fileName }) => {
    const options = {
      title: 'Delete File',
      message: 'All wallet data will be lost. Are You Sure?',
      buttons: ['Delete Wallet File', 'Cancel']
    };
    const { response } = await dialog.showMessageBox(browserWindow, options);
    if (response === 0) {
      try {
        this.txManager.clearData();
        await unlinkFileAsync(fileName);
        browserWindow.reload();
      } catch (err) {
        console.error('Error deleting wallet file'); // eslint-disable-line no-console
      }
    }
  };

  wipeOut = async ({ browserWindow }) => {
    const options = {
      type: 'warning',
      title: 'Reinstall App',
      message: 'WARNING: All wallets, addresses and settings will be lost. Are you sure you want to do this?',
      buttons: ['Delete All', 'Cancel']
    };
    const { response } = await dialog.showMessageBox(browserWindow, options);
    if (response === 0) {
      browserWindow.destroy();
      this.txManager.clearData();
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
}

export default WalletManager;
