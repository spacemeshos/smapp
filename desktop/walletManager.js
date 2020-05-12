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
    ipcMain.on(ipcConsts.CREATE_WALLET_FILE, async (event, request) => {
      await this.createWalletFile({ event, ...request.data });
    });
    ipcMain.on(ipcConsts.READ_WALLET_FILES, async (event) => {
      await this.readWalletFiles({ event });
    });
    ipcMain.on(ipcConsts.UNLOCK_WALLET_FILE, async (event, request) => {
      await this.unlockWalletFile({ event, ...request.data });
    });
    ipcMain.on(ipcConsts.UPDATE_WALLET_FILE, async (event, request) => {
      await this.updateWalletFile({ event, ...request.data });
    });
    ipcMain.on(ipcConsts.COPY_FILE, async (event, request) => {
      await this.copyFile({ event, ...request.data });
    });
    ipcMain.on(ipcConsts.SHOW_FILE_IN_FOLDER, (event, request) => {
      this.showFileInDirectory({ ...request.data });
    });
    ipcMain.on(ipcConsts.DELETE_FILE, async (event, request) => {
      await this.deleteWalletFile({ browserWindow: mainWindow, ...request });
    });
    ipcMain.on(ipcConsts.WIPE_OUT, async () => {
      await this.wipeOut({ browserWindow: mainWindow });
    });

    ipcMain.on(ipcConsts.GET_BALANCE, async (event, request) => {
      await this.getBalance({ event, ...request.data });
    });
    ipcMain.on(ipcConsts.GET_NONCE, async (event, request) => {
      await this.getNonce({ event, ...request.data });
    });
    ipcMain.on(ipcConsts.SEND_TX, async (event, request) => {
      await this.txManager.sendTx({ event, ...request.data });
    });
    ipcMain.on(ipcConsts.UPDATE_TX, async (event, request) => {
      await this.txManager.updateTransaction({ event, ...request.data });
    });
    ipcMain.on(ipcConsts.GET_ACCOUNT_TXS, async (event, request) => {
      await this.txManager.getAccountTxs({ event, ...request.data });
    });
    ipcMain.on(ipcConsts.GET_ACCOUNT_REWARDS, async (event, request) => {
      await this.txManager.getAccountRewards({ event, ...request.data });
    });
  };

  createWalletFile = async ({ event, timestamp, dataToEncrypt, password }) => {
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
      event.sender.send(ipcConsts.CREATE_WALLET_FILE_RESPONSE, { error: null, meta });
    } catch (error) {
      event.sender.send(ipcConsts.CREATE_WALLET_FILE_RESPONSE, { error, meta: null });
    }
  };

  readWalletFiles = async ({ event }) => {
    try {
      const files = await readDirectoryAsync(appFilesDirPath);
      const regex = new RegExp('(my_wallet_).*.(json)', 'ig');
      const filteredFiles = files.filter((file) => file.match(regex));
      const filesWithPath = filteredFiles.map((file) => path.join(appFilesDirPath, file));
      event.sender.send(ipcConsts.READ_WALLET_FILES_RESPONSE, { error: null, files: filesWithPath });
    } catch (error) {
      event.sender.send(ipcConsts.READ_WALLET_FILES_RESPONSE, { error, filesWithPath: null });
    }
  };

  unlockWalletFile = async ({ event, path, password }) => {
    try {
      const fileContent = await readFileAsync(path);
      const { crypto, meta, contacts } = JSON.parse(fileContent);
      const key = FileEncryptionService.createEncryptionKey({ password });
      const decryptedDataJSON = FileEncryptionService.decryptData({ data: crypto.cipherText, key });
      const { accounts, mnemonic } = JSON.parse(decryptedDataJSON);
      this.txManager.setAccounts({ accounts });
      event.sender.send(ipcConsts.UNLOCK_WALLET_FILE_RESPONSE, { error: null, accounts, mnemonic, meta, contacts });
    } catch (error) {
      event.sender.send(ipcConsts.UNLOCK_WALLET_FILE_RESPONSE, { error, accounts: null, mnemonic: null, meta: null, contacts: null });
    }
  };

  getBalance = async ({ event, address }) => {
    try {
      const { value } = await netService.getBalance({ address });
      event.sender.send(ipcConsts.GET_BALANCE_RESPONSE, { error: null, balance: value });
    } catch (error) {
      if (typeof error.message === 'string' && error.message.includes('account does not exist')) {
        event.sender.send(ipcConsts.GET_BALANCE_RESPONSE, { error: null, balance: 0 });
      } else {
        event.sender.send(ipcConsts.GET_BALANCE_RESPONSE, { error, balance: null });
      }
    }
  };

  getNonce = async ({ event, address }) => {
    try {
      const { value } = await netService.getNonce({ address });
      event.sender.send(ipcConsts.GET_NONCE_RESPONSE, { error: null, nonce: value });
    } catch (error) {
      event.sender.send(ipcConsts.GET_NONCE_RESPONSE, { error, nonce: null });
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

  copyFile = async ({ event, filePath, copyToDocuments }) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const walletNumber = StoreService.get({ key: 'walletNumber' });
    const fileName = copyToDocuments ? `Wallet_Backup_${timestamp}.json` : `my_wallet_${walletNumber}-${new Date().toISOString().replace(/:/, '-')}.json`;
    const newFilePath = copyToDocuments ? path.join(documentsDirPath, fileName) : path.join(appFilesDirPath, fileName);
    try {
      await copyFileAsync(filePath, newFilePath);
      StoreService.set({ key: 'walletNumber', value: walletNumber + 1 });
      event.sender.send(ipcConsts.COPY_FILE_RESPONSE, { error: null, newFilePath });
    } catch (error) {
      event.sender.send(ipcConsts.COPY_FILE_RESPONSE, { error });
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
