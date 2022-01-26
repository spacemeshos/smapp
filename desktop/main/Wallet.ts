import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { app, dialog, ipcMain, shell } from 'electron';
import Logger from '../logger';
import { ipcConsts } from '../../app/vars';
import { Account, SocketAddress, Wallet, WalletFile, WalletMeta, WalletSecrets, WalletSecretsEncrypted } from '../../shared/types';
import { isRemoteNodeApi, stringifySocketAddress } from '../../shared/utils';
import fileEncryptionService from '../fileEncryptionService';
import CryptoService from '../cryptoService';
import encryptionConst from '../encryptionConst';
import StoreService from '../storeService';
import { DOCUMENTS_DIR, MINUTE, USERDATA_DIR } from './constants';
import { AppContext } from './context';
import Networks from './Networks';
import { getNodeLogsPath } from './utils';

const logger = Logger({ className: 'WalletFiles' });

//
// Encryption tools
//

const decryptCrypto = (crypto: WalletSecretsEncrypted, password: string): WalletSecrets => {
  const key = fileEncryptionService.createEncryptionKey({ password });
  const decryptedRaw = fileEncryptionService.decryptData({ data: crypto.cipherText, key });
  const decrypted = JSON.parse(decryptedRaw) as WalletSecrets; // TODO: Add validation
  return decrypted;
};

const encryptCrypto = (cryptoDecrypted: WalletSecrets, password: string): WalletSecretsEncrypted => {
  const key = fileEncryptionService.createEncryptionKey({ password });
  const encrypted = fileEncryptionService.encryptData({ data: JSON.stringify(cryptoDecrypted), key });
  return { cipher: 'AES-128-CTR', cipherText: encrypted };
};

//
// FileSystem interaction
//

const list = async () => {
  try {
    const files = await fs.readdir(USERDATA_DIR);
    const regex = new RegExp('(my_wallet_).*.(json)', 'ig');
    const filteredFiles = files.filter((file) => file.match(regex));
    const filesWithPath = filteredFiles.map((file) => path.join(USERDATA_DIR, file));
    return { error: null, files: filesWithPath };
  } catch (error) {
    logger.error('readWalletFiles', error);
    return { error, files: null };
  }
};

const loadRaw = async (path: string): Promise<WalletFile> => {
  const fileContent = await fs.readFile(path, { encoding: 'utf8' });
  return JSON.parse(fileContent) as WalletFile;
};

const saveRaw = async (context: AppContext, wallet: WalletFile) => {
  const filename = `my_wallet_${wallet.meta.created}.json`;
  const filepath = path.resolve(USERDATA_DIR, filename);
  context.walletPath = filepath;
  if (context.wallet) {
    context.wallet.meta = wallet.meta;
  }
  await fs.writeFile(filepath, JSON.stringify(wallet), { encoding: 'utf8' });
  return { filename, filepath };
};

const load = async (path: string, password: string): Promise<Wallet> => {
  const { crypto, meta } = await loadRaw(path);
  const cryptoDecoded = decryptCrypto(crypto, password);
  return { meta, crypto: cryptoDecoded };
};

const save = (context: AppContext, password: string, wallet: Wallet): Promise<{ filename: string; filepath: string }> => {
  const { meta, crypto } = wallet;
  const encrypted = encryptCrypto(crypto, password);
  const fileContent: WalletFile = {
    meta,
    crypto: encrypted,
  };
  if (!context.wallet) {
    context.wallet = wallet;
  } else {
    context.wallet.crypto = crypto;
  }
  return saveRaw(context, fileContent);
};

const updateMeta = async (context: AppContext, path: string, meta: Partial<WalletMeta>) => {
  const wallet = await loadRaw(path);
  const newWallet = { ...wallet, meta: { ...wallet.meta, ...meta } };
  await saveRaw(context, newWallet);
  return newWallet;
};

const updateSecrets = async (context: AppContext, path: string, password: string, crypto: Partial<WalletSecrets>) => {
  const wallet = await load(path, password);
  const newWallet = { ...wallet, crypto: { ...wallet.crypto, ...crypto } };
  return save(context, password, newWallet);
};

const copy = async (filePath: string, copyToDocuments: boolean) => {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const fileName = copyToDocuments ? `wallet_backup_${timestamp}.json` : `my_wallet_${timestamp}.json`;
  const newFilePath = copyToDocuments ? path.join(DOCUMENTS_DIR, fileName) : path.join(USERDATA_DIR, fileName);
  await fs.copyFile(filePath, newFilePath);
  return newFilePath;
};

const showFileInDirectory = async (context: AppContext, { isBackupFile, isLogFile }: { isBackupFile?: boolean; isLogFile?: boolean }) => {
  if (isBackupFile) {
    try {
      const files = await fs.readdir(DOCUMENTS_DIR);
      const regex = new RegExp('(wallet_backup_).*.(json)', 'ig');
      const filteredFiles = files.filter((file) => file.match(regex));
      const filesWithPath = filteredFiles.map((file) => path.join(DOCUMENTS_DIR, file));
      if (filesWithPath && filesWithPath[0]) {
        shell.showItemInFolder(filesWithPath[0]);
      } else {
        shell.openPath(DOCUMENTS_DIR);
      }
    } catch (error) {
      logger.error('showFileInDirectory', error);
    }
  } else if (isLogFile) {
    const logFilePath = getNodeLogsPath(context.currentNetwork?.netID);
    shell.showItemInFolder(logFilePath);
  } else {
    shell.openPath(USERDATA_DIR);
  }
};

const deleteWalletFile = async (context: AppContext, filepath: string) => {
  if (!context.mainWindow) return;
  const options = {
    title: 'Delete File',
    message: 'All wallet data will be lost. Are You Sure?',
    buttons: ['Delete Wallet File', 'Cancel'],
  };
  const { response } = await dialog.showMessageBox(context.mainWindow, options);
  if (response === 0) {
    try {
      StoreService.clear();
      // await unlinkFileAsync(fileName);
      await fs.unlink(filepath);
      delete context.wallet;
      delete context.walletPath;
      context.mainWindow.reload();
    } catch (error) {
      logger.error('deleteWalletFile', error);
    }
  }
};

const wipeOut = async (context: AppContext) => {
  if (!context.mainWindow) return;
  const options = {
    type: 'warning',
    title: 'Reinstall App',
    message: 'WARNING: All wallets, addresses and settings will be lost. Are you sure you want to do this?',
    buttons: ['Delete All', 'Cancel'],
  };
  const { response } = await dialog.showMessageBox(context.mainWindow, options);
  if (response === 0) {
    StoreService.clear();
    const command = os.type() === 'Windows_NT' ? `rmdir /q/s '${USERDATA_DIR}'` : `rm -rf '${USERDATA_DIR}'`;
    exec(command, (error: any) => {
      if (error) {
        logger.error('ipcMain wipeOut', error);
      }
      console.log('deleted'); // eslint-disable-line no-console
    });
    context.isAppClosing = true;
    context.mainWindow.destroy();
    app.quit();
  }
};

//
// Wallet data constructors
// Pure
//

const createAccount = ({ index, timestamp, publicKey, secretKey }: { index: number; timestamp: string; publicKey: string; secretKey: string }): Account => ({
  displayName: index > 0 ? `Account ${index}` : 'Main Account',
  created: timestamp,
  path: `0/0/${index}`,
  publicKey,
  secretKey,
});

const create = (mnemonicSeed?: string) => {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const mnemonic = mnemonicSeed || CryptoService.generateMnemonic();
  const { publicKey, secretKey } = CryptoService.deriveNewKeyPair({ mnemonic, index: 0 });
  const crypto = {
    mnemonic,
    accounts: [createAccount({ index: 0, timestamp, publicKey, secretKey })],
    contacts: [],
  };
  const meta: WalletMeta = {
    displayName: 'Main Wallet',
    created: timestamp,
    netId: -1,
    remoteApi: '',
    meta: { salt: encryptionConst.DEFAULT_SALT },
  };
  return { meta, crypto };
};

//
// Subscribe on events
//

const ensureNetworkExist = async (context: AppContext, wallet: Wallet) => {
  const { meta } = wallet;
  await Networks.update(context);
  if (!Networks.hasNetwork(context, meta.netId)) {
    context.mainWindow?.webContents.send(ipcConsts.REQUEST_SWITCH_NETWORK, { isWalletOnly: !!meta.remoteApi });
    return false;
  }
  return true;
};

const activate = async (context: AppContext, wallet: Wallet) => {
  const { meta } = wallet;
  await Networks.update(context);
  if (!Networks.hasNetwork(context, meta.netId)) return;

  // Switch network if needed
  context.currentNetwork?.netID !== meta.netId && (await Networks.switchNetwork(context, meta.netId));
  // TODO: handle stop smeshing & cleaning up POST directory?
  // Activate Wallet
  await context.managers?.wallet?.activate(wallet);
};
const activateAccounts = (context: AppContext, accounts: Account[]) => {
  context.managers?.wallet?.activateAccounts(accounts);
};

const subscribe = (context: AppContext) => {
  setInterval(() => context.wallet && ensureNetworkExist(context, context.wallet), 5 * MINUTE);

  ipcMain.handle(ipcConsts.READ_WALLET_FILES, list);

  ipcMain.handle(ipcConsts.W_M_COPY_FILE, (_event, { filePath, copyToDocuments }: { filePath: string; copyToDocuments: boolean }) => copy(filePath, copyToDocuments));

  ipcMain.handle(
    ipcConsts.W_M_CREATE_WALLET,
    async (_event, { password, existingMnemonic, netId, apiUrl }: { password: string; existingMnemonic: string; apiUrl: SocketAddress; netId: number }) => {
      const wallet = create(existingMnemonic);

      wallet.meta.netId = netId;
      wallet.meta.remoteApi = stringifySocketAddress(apiUrl);

      await save(context, password, wallet);
      await activate(context, wallet);
      activateAccounts(context, wallet.crypto.accounts);
      return wallet;
    }
  );
  ipcMain.handle(ipcConsts.W_M_UNLOCK_WALLET, async (_event, { path, password }: { path: string; password: string }) => {
    try {
      const wallet = await load(path, password);
      const { meta, crypto } = wallet;
      const { accounts, mnemonic, contacts } = crypto;
      const isNetworkExist = Networks.hasNetwork(context, meta.netId);
      await activate(context, wallet);
      activateAccounts(context, wallet.crypto.accounts);

      context.wallet = wallet;
      context.walletPath = path;

      return { error: null, accounts, mnemonic, meta, contacts, isNetworkExist };
    } catch (error) {
      logger.error('W_M_UNLOCK_WALLET', error, { path, password });
      return { error, accounts: null, mnemonic: null, meta: null, contacts: null, isNetworkExist: false };
    }
  });
  ipcMain.handle(ipcConsts.W_M_CREATE_NEW_ACCOUNT, async (_event, { fileName, password }: { fileName: string; password: string }) => {
    const wallet = await load(fileName, password);
    const { meta, crypto } = wallet;
    const timestamp = new Date().toISOString().replace(/:/, '-');
    const { publicKey, secretKey } = CryptoService.deriveNewKeyPair({
      mnemonic: crypto.mnemonic,
      index: crypto.accounts.length,
    });
    const newAccount = createAccount({ index: crypto.accounts.length, timestamp, publicKey, secretKey });
    const newCrypto = { ...crypto, accounts: [...crypto.accounts, newAccount] };

    await save(context, password, { meta, crypto: newCrypto });
    context.managers?.wallet?.activateAccounts([newAccount]);
    return newAccount;
  });

  ipcMain.handle(ipcConsts.W_M_ACTIVATE, async (_event, apiUrl: string) => {
    try {
      const { wallet, walletPath } = context;
      if (!wallet || !walletPath) return;
      const newWallet: Wallet = { ...wallet, meta: { ...wallet.meta, remoteApi: apiUrl } };
      await activate(context, newWallet);
    } catch (e) {
      logger.error('W_M_ACTIVATE', true, apiUrl);
      throw e;
    }
  });

  ipcMain.handle(ipcConsts.SWITCH_API_PROVIDER, async (_event, apiUrl: SocketAddress) => {
    const { walletPath } = context;
    if (!walletPath) return; // TODO
    await updateMeta(context, walletPath, { remoteApi: isRemoteNodeApi(apiUrl) ? stringifySocketAddress(apiUrl) : '' });
    // context.managers.wallet?.switchApiProvider(apiUrl);
    if (isRemoteNodeApi(apiUrl)) {
      // We don't need to start Node here
      // because it will be started on unlocking/creating the wallet file
      // but we have to stop it in case that User switched to wallet mode
      await context.managers.node?.stopNode();
    }
    context.wallet && context.managers.wallet?.activate(context.wallet);
  });

  ipcMain.handle(ipcConsts.SWITCH_NETWORK, async (_, netId: number) => {
    const { wallet, walletPath } = context;
    // Ensure that Network is switched even in case if no wallet found
    // It useful in case, when we're creating a wallet, and have to choose
    // a public GRPC API for Wallet only mode. So we need to list them.
    await Networks.switchNetwork(context, netId);
    if (!walletPath || !wallet) return; // TODO
    await updateMeta(context, walletPath, { netId });
    await activate(context, wallet);
  });

  ipcMain.on(ipcConsts.W_M_UPDATE_WALLET_META, <T extends keyof WalletMeta>(_event, { fileName, key, value }: { fileName: string; key: T; value: WalletMeta[T] }) =>
    updateMeta(context, fileName, { [key]: value })
  );
  ipcMain.on(ipcConsts.W_M_UPDATE_WALLET_SECRETS, (_event, { fileName, password, data }: { fileName: string; password: string; data: WalletSecrets }) =>
    updateSecrets(context, fileName, password, data)
  );

  ipcMain.on(ipcConsts.W_M_SHOW_FILE_IN_FOLDER, (_event, request) => showFileInDirectory(context, { ...request }));

  ipcMain.on(ipcConsts.W_M_SHOW_DELETE_FILE, (_event, filepath) => deleteWalletFile(context, filepath));

  ipcMain.on(ipcConsts.W_M_WIPE_OUT, () => wipeOut(context));
};

export default { subscribe };
