import fs from 'fs';
import util from 'util';
import path from 'path';
import os from 'os';
import { app, dialog, shell, ipcMain, BrowserWindow } from 'electron';
import { ipcConsts } from '../app/vars';
import { SocketAddress, WalletFile, WalletMeta } from '../shared/types';
import MeshService from './MeshService';
import GlobalStateService from './GlobalStateService';
import TransactionManager from './TransactionManager';
import fileEncryptionService from './fileEncryptionService';
import cryptoService from './cryptoService';
import encryptionConst from './encryptionConst';
import Logger from './logger';
import StoreService from './storeService';
import TransactionService from './TransactionService';
import NodeManager from './NodeManager';

const logger = Logger({ className: 'WalletManager' });

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
  private readonly meshService: any;

  private readonly glStateService: any;

  private readonly txService: TransactionService;

  private nodeManager: NodeManager;

  private txManager: TransactionManager;

  private mnemonic = '';

  constructor(mainWindow: BrowserWindow, nodeManager: NodeManager) {
    this.subscribeToEvents(mainWindow);
    this.nodeManager = nodeManager;
    this.meshService = new MeshService();
    this.glStateService = new GlobalStateService();
    this.txService = new TransactionService();
    this.txManager = new TransactionManager(this.meshService, this.glStateService, this.txService, mainWindow);
  }

  __getNewAccountFromTemplate = ({ index, timestamp, publicKey, secretKey }: { index: number; timestamp: string; publicKey: string; secretKey: string }) => ({
    displayName: index > 0 ? `Account ${index}` : 'Main Account',
    created: timestamp,
    path: `0/0/${index}`,
    publicKey,
    secretKey
  });

  subscribeToEvents = (mainWindow: BrowserWindow) => {
    ipcMain.handle(ipcConsts.W_M_ACTIVATE, (_event, request) => {
      try {
        this.activateWalletManager({ ip: request.ip, port: request.port });
      } catch (e) {
        logger.error('W_M_ACTIVATE channel', true, request);
        throw e;
      }
    });
    ipcMain.handle(ipcConsts.W_M_GET_NETWORK_DEFINITIONS, () => {
      const netId = StoreService.get('netSettings.netId');
      const netName = StoreService.get('netSettings.netName');
      const genesisTime = StoreService.get('netSettings.genesisTime');
      const minCommitmentSize = StoreService.get('netSettings.minCommitmentSize');
      const explorerUrl = StoreService.get('netSettings.explorerUrl');
      return { netId, netName, genesisTime, minCommitmentSize, explorerUrl };
    });
    ipcMain.handle(ipcConsts.W_M_GET_CURRENT_LAYER, async () => {
      const { error, currentLayer } = await this.meshService.getCurrentLayer();
      return error ? { currentLayer: -1 } : { currentLayer };
    });
    ipcMain.handle(ipcConsts.W_M_GET_GLOBAL_STATE_HASH, async () => {
      const { error, layer, rootHash } = await this.glStateService.getGlobalStateHash();
      return error ? { layer: -1, rootHash: '' } : { layer, rootHash };
    });
    ipcMain.handle(ipcConsts.W_M_CREATE_WALLET, (_event, request) =>
      this.createWalletFile({ ...request }).catch((err) => {
        logger.error('W_M_CREATE_WALLET channel', err, request);
        throw err;
      })
    );
    ipcMain.handle(ipcConsts.W_M_READ_WALLET_FILES, async () => {
      const res = await this.readWalletFiles();
      return res;
    });
    ipcMain.handle(ipcConsts.W_M_UNLOCK_WALLET, async (_event, request) => {
      const res = await this.unlockWalletFile({ ...request });
      return res;
    });
    ipcMain.on(ipcConsts.W_M_UPDATE_WALLET, async (_event, request) => {
      await this.updateWalletFile({ ...request });
    });
    ipcMain.handle(ipcConsts.W_M_CREATE_NEW_ACCOUNT, async (_event, request) => {
      const res = await this.createNewAccount({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.W_M_COPY_FILE, async (_event, request) => {
      const res = await this.copyFile({ ...request });
      return res;
    });
    ipcMain.on(ipcConsts.W_M_SHOW_FILE_IN_FOLDER, (_event, request) => {
      this.showFileInDirectory({ ...request });
    });
    ipcMain.on(ipcConsts.W_M_SHOW_DELETE_FILE, async (_event, request) => {
      await this.deleteWalletFile({ browserWindow: mainWindow, ...request });
    });
    ipcMain.on(ipcConsts.W_M_WIPE_OUT, async () => {
      await this.wipeOut({ browserWindow: mainWindow });
    });

    ipcMain.handle(ipcConsts.W_M_SEND_TX, async (_event, request) => {
      const res = await this.txManager.sendTx({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.W_M_UPDATE_TX, async (event, request) => {
      await this.txManager.updateTransaction({ event, ...request });
      return true;
    });
    ipcMain.handle(ipcConsts.W_M_SIGN_MESSAGE, async (_event, request) => {
      const { message, accountIndex } = request;
      const res = await cryptoService.signMessage({ message, secretKey: this.txManager.accounts[accountIndex].secretKey });
      return res;
    });
  };

  activateWalletManager = ({ ip = '', port = '' }: Partial<SocketAddress>) => {
    this.meshService.createService(ip, port);
    this.glStateService.createService(ip, port);
    this.txService.createService(ip, port);
  };

  createWalletFile = async ({ password, existingMnemonic, ip = '', port = '' }: { password: string; existingMnemonic: string; ip: string; port: string }) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    this.mnemonic = existingMnemonic || cryptoService.generateMnemonic();
    const { publicKey, secretKey } = cryptoService.deriveNewKeyPair({ mnemonic: this.mnemonic, index: 0 });
    const dataToEncrypt = {
      mnemonic: this.mnemonic,
      accounts: [this.__getNewAccountFromTemplate({ index: 0, timestamp, publicKey, secretKey })],
      contacts: []
    };
    await this.nodeManager.activateNodeProcess();
    this.activateWalletManager({ ip, port });
    this.txManager.setAccounts({ accounts: dataToEncrypt.accounts });
    const key = fileEncryptionService.createEncryptionKey({ password });
    const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify(dataToEncrypt), key });
    const meta: WalletMeta = {
      displayName: 'Main Wallet',
      created: timestamp,
      netId: StoreService.get('netSettings.netId'),
      meta: { salt: encryptionConst.DEFAULT_SALT }
    };
    const fileContent: WalletFile = {
      meta,
      crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData }
    };
    const fileName = `my_wallet_${timestamp}.json`;
    const fileNameWithPath = path.resolve(appFilesDirPath, fileName);
    await writeFileAsync(fileNameWithPath, JSON.stringify(fileContent));
    return { meta, accounts: dataToEncrypt.accounts, mnemonic: this.mnemonic };
  };

  readWalletFiles = async () => {
    try {
      const files = await readDirectoryAsync(appFilesDirPath);
      const regex = new RegExp('(my_wallet_).*.(json)', 'ig');
      const filteredFiles = files.filter((file) => file.match(regex));
      const filesWithPath = filteredFiles.map((file) => path.join(appFilesDirPath, file));
      return { error: null, files: filesWithPath };
    } catch (error) {
      logger.error('readWalletFiles', error);
      return { error, files: null };
    }
  };

  unlockWalletFile = async ({ path, password }: { path: string; password: string }) => {
    try {
      const fileContent = await readFileAsync(path);
      // @ts-ignore
      const { crypto, meta } = JSON.parse(fileContent) as WalletFile;
      const key = fileEncryptionService.createEncryptionKey({ password });
      const decryptedDataJSON = fileEncryptionService.decryptData({ data: crypto.cipherText, key });
      const { accounts, mnemonic, contacts } = JSON.parse(decryptedDataJSON);
      await this.nodeManager.activateNodeProcess();
      this.activateWalletManager({ ip: '', port: '' }); // TODO: Support Wallet Only mode
      this.txManager.setAccounts({ accounts });
      this.mnemonic = mnemonic;
      return { error: null, accounts, mnemonic, meta, contacts };
    } catch (error) {
      logger.error('unlockWalletFile', error, { path, password });
      return { error, accounts: null, mnemonic: null, meta: null, contacts: null };
    }
  };

  updateWalletFile = async ({ fileName, password, data }: { fileName: string; password: string; data: any }) => {
    try {
      const rawFileContent = await readFileAsync(fileName);
      // @ts-ignore
      const fileContent = JSON.parse(rawFileContent);
      let field = 'meta';
      let dataToUpdate = data;
      if (password) {
        field = 'crypto';
        const key = fileEncryptionService.createEncryptionKey({ password });
        const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify(data), key });
        dataToUpdate = { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData };
        this.txManager.setAccounts({ accounts: data.accounts });
      }
      await writeFileAsync(fileName, JSON.stringify({ ...fileContent, [field]: dataToUpdate }));
    } catch (error) {
      logger.error('updateWalletFile', error);
    }
  };

  createNewAccount = async ({ fileName, password }: { fileName: string; password: string }) => {
    try {
      const key = fileEncryptionService.createEncryptionKey({ password });
      const rawFileContent = await readFileAsync(fileName);
      // @ts-ignore
      const fileContent = JSON.parse(rawFileContent);
      const decryptedDataJSON = fileEncryptionService.decryptData({ data: fileContent.crypto.cipherText, key });
      const { mnemonic, accounts, contacts } = JSON.parse(decryptedDataJSON);

      const { publicKey, secretKey } = cryptoService.deriveNewKeyPair({ mnemonic, index: accounts.length });
      const timestamp = new Date().toISOString().replace(/:/, '-');
      const newAccount = this.__getNewAccountFromTemplate({ index: accounts.length, timestamp, publicKey, secretKey });
      const dataToEncrypt = {
        mnemonic,
        accounts: [...accounts, newAccount],
        contacts
      };
      const encryptedAccountsData = fileEncryptionService.encryptData({ data: JSON.stringify(dataToEncrypt), key });
      await writeFileAsync(fileName, JSON.stringify({ ...fileContent, crypto: { cipher: 'AES-128-CTR', cipherText: encryptedAccountsData } }));
      await this.nodeManager.activateNodeProcess();
      this.txManager.addAccount({ account: newAccount });
      return { error: null, newAccount };
    } catch (error) {
      logger.error('createNewAccount', error);
      return { error };
    }
  };

  copyFile = async ({ filePath, copyToDocuments }: { filePath: string; copyToDocuments: boolean }) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName = copyToDocuments ? `wallet_backup_${timestamp}.json` : `my_wallet_${timestamp}.json`;
    const newFilePath = copyToDocuments ? path.join(documentsDirPath, fileName) : path.join(appFilesDirPath, fileName);
    try {
      await copyFileAsync(filePath, newFilePath);
      return { error: null, newFilePath };
    } catch (error) {
      logger.error('copyFile', error);
      return { error };
    }
  };

  showFileInDirectory = async ({ isBackupFile, isLogFile }: { isBackupFile?: boolean; isLogFile?: boolean }) => {
    if (isBackupFile) {
      try {
        const files = await readDirectoryAsync(documentsDirPath);
        const regex = new RegExp('(wallet_backup_).*.(json)', 'ig');
        const filteredFiles = files.filter((file) => file.match(regex));
        const filesWithPath = filteredFiles.map((file) => path.join(documentsDirPath, file));
        if (filesWithPath && filesWithPath[0]) {
          shell.showItemInFolder(filesWithPath[0]);
        } else {
          shell.openPath(documentsDirPath);
        }
      } catch (error) {
        logger.error('showFileInDirectory', error);
      }
    } else if (isLogFile) {
      const logFilePath = path.resolve(appFilesDirPath, 'spacemesh-log.txt');
      shell.showItemInFolder(logFilePath);
    } else {
      shell.openPath(appFilesDirPath);
    }
  };

  deleteWalletFile = async ({ browserWindow, fileName }: { browserWindow: BrowserWindow; fileName: string }) => {
    const options = {
      title: 'Delete File',
      message: 'All wallet data will be lost. Are You Sure?',
      buttons: ['Delete Wallet File', 'Cancel']
    };
    const { response } = await dialog.showMessageBox(browserWindow, options);
    if (response === 0) {
      try {
        StoreService.clear();
        await unlinkFileAsync(fileName);
        browserWindow.reload();
      } catch (error) {
        logger.error('deleteWalletFile', error);
      }
    }
  };

  wipeOut = async ({ browserWindow }: { browserWindow: BrowserWindow }) => {
    const options = {
      type: 'warning',
      title: 'Reinstall App',
      message: 'WARNING: All wallets, addresses and settings will be lost. Are you sure you want to do this?',
      buttons: ['Delete All', 'Cancel']
    };
    const { response } = await dialog.showMessageBox(browserWindow, options);
    if (response === 0) {
      browserWindow.destroy();
      StoreService.clear();
      const command = os.type() === 'Windows_NT' ? `rmdir /q/s '${appFilesDirPath}'` : `rm -rf '${appFilesDirPath}'`;
      exec(command, (error: any) => {
        if (error) {
          logger.error('ipcMain wipeOut', error);
        }
        console.log('deleted'); // eslint-disable-line no-console
      });
      app.quit();
    }
  };
}

export default WalletManager;
