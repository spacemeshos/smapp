import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import * as R from 'ramda';
import { app, dialog, ipcMain, shell } from 'electron';
import Logger from '../logger';
import { ipcConsts } from '../../app/vars';
import { Account, SocketAddress, Wallet, WalletMeta, WalletSecrets, WalletType } from '../../shared/types';
import { isLocalNodeApi, isRemoteNodeApi, isWalletOnlyType, stringifySocketAddress } from '../../shared/utils';
import CryptoService from '../cryptoService';
import encryptionConst from '../encryptionConst';
import StoreService from '../storeService';
import { DOCUMENTS_DIR, MINUTE, DEFAULT_WALLETS_DIRECTORY } from './constants';
import { AppContext } from './context';
import Networks from './Networks';
import { getNodeLogsPath } from './utils';
import { checkForUpdates } from './autoUpdate';
import { copyWalletFile, listWallets, loadWallet, saveWallet, updateWalletMeta, updateWalletSecrets } from './walletFile';

const logger = Logger({ className: 'WalletFiles' });

const list = async () => {
  try {
    const files = await listWallets(DEFAULT_WALLETS_DIRECTORY, StoreService.get('walletFiles'));
    return { error: null, files };
  } catch (error) {
    return { error, files: null };
  }
};

//
// Update handlers
//

const updateWalletContext = (context: AppContext, wallet: Wallet) => {
  context.wallet = wallet;
};

const updateMeta = async (context: AppContext, walletPath: string, meta: Partial<WalletMeta>) => {
  const wallet = await updateWalletMeta(walletPath, meta);
  context.walletPath = walletPath;
  if (context.wallet) {
    context.wallet.meta = wallet.meta;
  }
  return wallet;
};

const updateSecrets = async (context: AppContext, walletPath: string, password: string, crypto: Partial<WalletSecrets>) => {
  const wallet = await updateWalletSecrets(walletPath, password, crypto);
  context.wallet = wallet;
  return wallet;
};

//
// FS Interactions
//

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
    shell.openPath(DEFAULT_WALLETS_DIRECTORY);
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
    const command = os.type() === 'Windows_NT' ? `rmdir /q/s '${DEFAULT_WALLETS_DIRECTORY}'` : `rm -rf '${DEFAULT_WALLETS_DIRECTORY}'`;
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
    type: WalletType.LocalNode,
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
  if (!Networks.hasNetwork(context, meta.netId) && context.networks.length > 0) {
    context.mainWindow?.webContents.send(ipcConsts.REQUEST_SWITCH_NETWORK, { isWalletOnly: isWalletOnlyType(meta.type) });
    return false;
  }
  return true;
};

const activateAccounts = (context: AppContext, accounts: Account[]) => {
  context.managers?.wallet?.activateAccounts(accounts);
};

const activate = async (context: AppContext, wallet: Wallet) => {
  const { meta } = wallet;
  await ensureNetworkExist(context, wallet);
  if (!Networks.hasNetwork(context, meta.netId)) return;

  // Switch network if needed
  context.currentNetwork?.netID !== meta.netId && (await Networks.switchNetwork(context, meta.netId));
  // TODO: handle stop smeshing & cleaning up POST directory?

  await context.managers?.wallet?.activate(wallet);
  activateAccounts(context, wallet.crypto.accounts);

  checkForUpdates(context);
};

const subscribe = (context: AppContext) => {
  setInterval(() => context.wallet && ensureNetworkExist(context, context.wallet), 30 * MINUTE);

  ipcMain.handle(ipcConsts.READ_WALLET_FILES, list);

  ipcMain.handle(ipcConsts.W_M_COPY_FILE, (_event, { filePath, copyToDocuments }: { filePath: string; copyToDocuments: boolean }) => copyWalletFile(filePath, copyToDocuments));
  ipcMain.handle(ipcConsts.W_M_ADD_WALLET_PATH, (_, filePath: string) => {
    const oldWalletFiles = StoreService.get('walletFiles');
    const newWalletFiles = R.uniq([...oldWalletFiles, filePath]);
    StoreService.set('walletFiles', newWalletFiles);
    return newWalletFiles;
  });

  ipcMain.handle(
    ipcConsts.W_M_CREATE_WALLET,
    async (
      _event,
      {
        password,
        existingMnemonic,
        type,
        netId,
        apiUrl,
      }: {
        password: string;
        existingMnemonic: string;
        type: WalletType;
        apiUrl: SocketAddress | null;
        netId: number;
      }
    ) => {
      const wallet = create(existingMnemonic);

      wallet.meta.netId = netId;
      wallet.meta.remoteApi = apiUrl ? stringifySocketAddress(apiUrl) : '';
      wallet.meta.type = type;

      updateWalletContext(context, wallet);

      // TODO: custom wallet path
      await saveWallet(path.resolve(DEFAULT_WALLETS_DIRECTORY, `my_wallet_${wallet.meta.created}.json`), password, wallet);
      await activate(context, wallet);
      return wallet;
    }
  );
  ipcMain.handle(ipcConsts.W_M_UNLOCK_WALLET, async (_event, { path, password }: { path: string; password: string }) => {
    try {
      const wallet = await loadWallet(path, password);
      const { meta, crypto } = wallet;
      const { accounts, mnemonic, contacts } = crypto;
      const isNetworkExist = Networks.hasNetwork(context, meta.netId);
      await activate(context, wallet);

      context.wallet = wallet;
      context.walletPath = path;

      return { error: null, accounts, mnemonic, meta, contacts, isNetworkExist, hasNetworks: context.networks.length > 0 };
    } catch (error) {
      logger.error('W_M_UNLOCK_WALLET', error, { path });
      return { error, accounts: null, mnemonic: null, meta: null, contacts: null, isNetworkExist: false };
    }
  });
  ipcMain.handle(ipcConsts.W_M_CREATE_NEW_ACCOUNT, async (_event, { fileName, password }: { fileName: string; password: string }) => {
    const wallet = await loadWallet(fileName, password);
    const { meta, crypto } = wallet;
    const timestamp = new Date().toISOString().replace(/:/, '-');
    const { publicKey, secretKey } = CryptoService.deriveNewKeyPair({
      mnemonic: crypto.mnemonic,
      index: crypto.accounts.length,
    });
    const newAccount = createAccount({ index: crypto.accounts.length, timestamp, publicKey, secretKey });
    const newCrypto = { ...crypto, accounts: [...crypto.accounts, newAccount] };
    const newWallet = { meta, crypto: newCrypto };
    updateWalletContext(context, newWallet);
    await saveWallet(fileName, password, newWallet);
    activateAccounts(context, [newAccount]);
    return newAccount;
  });

  ipcMain.handle(ipcConsts.SWITCH_API_PROVIDER, async (_event, apiUrl: SocketAddress | null) => {
    const { wallet, walletPath } = context;
    if (!walletPath || !wallet) return; // TODO
    await updateMeta(context, walletPath, {
      remoteApi: apiUrl && isRemoteNodeApi(apiUrl) ? stringifySocketAddress(apiUrl) : '',
      type: apiUrl && isLocalNodeApi(apiUrl) ? WalletType.LocalNode : WalletType.RemoteApi,
    });
    if (apiUrl && isRemoteNodeApi(apiUrl)) {
      // We don't need to start Node here
      // because it will be started on unlocking/creating the wallet file
      // but we have to stop it in case that User switched to wallet mode
      await context.managers.node?.stopNode();
    }
    await activate(context, wallet);
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
