import fs from 'fs';
import util from 'util';
import path from 'path';
import os from 'os';
import { app, dialog, shell, ipcMain } from 'electron';
import { ipcConsts } from '../app/vars';
import TransactionManager from './transactionManager';
import netService from './netService';
import fileEncryptionService from './fileEncryptionService';
import cryptoService from './cryptoService';
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

  __getNewAccountFromTemplate = ({ index, timestamp, publicKey, secretKey }) => ({
    displayName: index > 0 ? `Account ${index}` : 'Main Account',
    created: timestamp,
    path: `0/0/${index}`,
    publicKey,
    secretKey
  });

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
    ipcMain.handle(ipcConsts.CREATE_NEW_ACCOUNT, async (event, request) => {
      const res = await this.createNewAccount({ ...request });
      return res;
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

    ipcMain.handle(ipcConsts.SIGN_MESSAGE, async (event, request) => {
      const { message, accountIndex } = request;
      const res = await cryptoService.signMessage({ message, secretKey: this.txManager.accounts[accountIndex].secretKey });
      return res;
    });
  };

  createWalletFile = async ({ password, existingMnemonic }) => {
    try {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      this.mnemonic = existingMnemonic || cryptoService.generateMnemonic();
      const { publicKey, secretKey } = cryptoService.deriveNewKeyPair({ mnemonic: this.mnemonic, index: 0 });
      const dataToEncrypt = {
        mnemonic: this.mnemonic,
        accounts: [this.__getNewAccountFromTemplate({ index: 0, timestamp, publicKey, secretKey })]
      };
      const meta = {
        displayName: 'Main Wallet',
        created: timestamp,
        netId: 0,
        meta: { salt: encryptionConst.DEFAULT_SALT }
      };
      this.txManager.setAccounts({ accounts: dataToEncrypt.accounts });
      const key = fileEncryptionService.createEncryptionKey({ password });
      const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify(dataToEncrypt), key });
      const fileContent = {
        meta,
        crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData },
        contacts: []
      };
      const fileName = `my_wallet_${timestamp}.json`;
      const fileNameWithPath = path.resolve(appFilesDirPath, fileName);
      await writeFileAsync(fileNameWithPath, JSON.stringify(fileContent));
      return { error: null, meta, accounts: dataToEncrypt.accounts, mnemonic: this.mnemonic };
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
      const key = fileEncryptionService.createEncryptionKey({ password });
      const decryptedDataJSON = fileEncryptionService.decryptData({ data: crypto.cipherText, key });
      const { accounts, mnemonic } = JSON.parse(decryptedDataJSON);
      this.txManager.setAccounts({ accounts });
      this.mnemonic = mnemonic;
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

  updateWalletFile = async ({ fileName, password, data, field }) => {
    try {
      const rawFileContent = await readFileAsync(fileName);
      const fileContent = JSON.parse(rawFileContent);
      let dataToUpdate = data;
      if (password) {
        const key = fileEncryptionService.createEncryptionKey({ password });
        const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify(data), key });
        dataToUpdate = { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData };
        this.txManager.addAccount({ account: data.accounts });
      }
      await writeFileAsync(fileName, JSON.stringify({ ...fileContent, [field]: dataToUpdate }));
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }
  };

  createNewAccount = async ({ fileName, password }) => {
    try {
      const { publicKey, secretKey } = cryptoService.deriveNewKeyPair({ mnemonic: this.mnemonic, index: this.txManager.accounts.length });
      const timestamp = new Date().toISOString().replace(/:/, '-');
      const newAccount = this.__getNewAccountFromTemplate({ index: this.txManager.accounts.length, timestamp, publicKey, secretKey });
      const dataToEncrypt = {
        mnemonic: this.mnemonic,
        accounts: [...this.txManager.accounts, newAccount]
      };
      const key = fileEncryptionService.createEncryptionKey({ password });
      const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify(dataToEncrypt), key });

      const rawFileContent = await readFileAsync(fileName);
      const fileContent = JSON.parse(rawFileContent);
      await writeFileAsync(fileName, JSON.stringify({ ...fileContent, crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData } }));

      this.txManager.addAccount({ account: newAccount });
      return { error: null, newAccount };
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
      return { error };
    }
  };

  copyFile = async ({ filePath, copyToDocuments }) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName = copyToDocuments ? `wallet_backup_${timestamp}.json` : `my_wallet_${new Date().toISOString().replace(/:/, '-')}.json`;
    const newFilePath = copyToDocuments ? path.join(documentsDirPath, fileName) : path.join(appFilesDirPath, fileName);
    try {
      await copyFileAsync(filePath, newFilePath);
      return { error: null, newFilePath };
    } catch (error) {
      return { error };
    }
  };

  showFileInDirectory = async ({ isBackupFile, isLogFile }) => {
    if (isBackupFile) {
      try {
        const files = await readDirectoryAsync(documentsDirPath);
        const regex = new RegExp('(wallet_backup_).*.(json)', 'ig');
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
