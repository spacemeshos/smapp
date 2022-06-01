import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import * as R from 'ramda';
import { app, dialog, ipcMain, shell } from 'electron';
import Logger from '../logger';
import { ipcConsts } from '../../app/vars';
import {
  Account,
  Wallet,
  WalletMeta,
  WalletSecrets,
  WalletType,
} from '../../shared/types';
import { stringifySocketAddress } from '../../shared/utils';
import CryptoService from '../cryptoService';
import encryptionConst from '../encryptionConst';
import { getISODate } from '../../shared/datetime';
import { CreateWalletRequest } from '../../shared/ipcMessages';
import StoreService from '../storeService';
import { DOCUMENTS_DIR, DEFAULT_WALLETS_DIRECTORY } from './constants';
import { AppContext } from './context';
import { getNodeLogsPath } from './utils';
import { copyWalletFile, listWallets } from './walletFile';

const logger = Logger({ className: 'WalletFiles' });

const list = async () => {
  try {
    const files = await listWallets(
      DEFAULT_WALLETS_DIRECTORY,
      StoreService.get('walletFiles')
    );
    return { error: null, files };
  } catch (error) {
    return { error, files: null };
  }
};

//
// FS Interactions
//

const showFileInDirectory = async (
  context: AppContext,
  { filePath, isLogFile }: { filePath?: string; isLogFile?: boolean }
) => {
  if (filePath) {
    try {
      shell.showItemInFolder(filePath);
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
      // delete context.wallet;
      // delete context.walletPath;
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
    message:
      'WARNING: All wallets, addresses and settings will be lost. Are you sure you want to do this?',
    buttons: ['Delete All', 'Cancel'],
  };
  const { response } = await dialog.showMessageBox(context.mainWindow, options);
  if (response === 0) {
    StoreService.clear();
    const command =
      os.type() === 'Windows_NT'
        ? `rmdir /q/s '${DEFAULT_WALLETS_DIRECTORY}'`
        : `rm -rf '${DEFAULT_WALLETS_DIRECTORY}'`;
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

const createAccount = ({
  index,
  timestamp,
  publicKey,
  secretKey,
}: {
  index: number;
  timestamp: string;
  publicKey: string;
  secretKey: string;
}): Account => ({
  displayName: index > 0 ? `Account ${index}` : 'Main Account',
  created: timestamp,
  path: `0/0/${index}`,
  publicKey,
  secretKey,
});

// Index stands for naming
const create = (index: number, mnemonicSeed?: string): Wallet => {
  const timestamp = getISODate();
  const mnemonic = mnemonicSeed || CryptoService.generateMnemonic();
  const { publicKey, secretKey } = CryptoService.deriveNewKeyPair({
    mnemonic,
    index: 0,
  });
  const crypto: WalletSecrets = {
    mnemonic,
    accounts: [createAccount({ index: 0, timestamp, publicKey, secretKey })],
    contacts: [],
  };
  const meta: WalletMeta = {
    displayName: index === 0 ? 'Main Wallet' : `Wallet ${index + 1}`,
    created: timestamp,
    type: WalletType.LocalNode,
    netId: -1,
    remoteApi: '',
    meta: { salt: encryptionConst.DEFAULT_SALT },
  };
  return { meta, crypto };
};

export const createNewAccount = (wallet: Wallet) => {
  const { meta, crypto } = wallet;
  const timestamp = getISODate();
  const { publicKey, secretKey } = CryptoService.deriveNewKeyPair({
    mnemonic: crypto.mnemonic,
    index: crypto.accounts.length,
  });
  const newAccount = createAccount({
    index: crypto.accounts.length,
    timestamp,
    publicKey,
    secretKey,
  });
  const newCrypto = {
    ...crypto,
    accounts: [...crypto.accounts, newAccount],
  };
  const newWallet = { meta, crypto: newCrypto };
  return newWallet;
};

// Pure utils
export const isNetIdMissing = (wallet: Wallet) => !wallet.meta.netId;
export const isApiMissing = (wallet: Wallet) => !wallet.meta.remoteApi;

//
// Subscribe on events
//

export const createWallet = async ({
  existingMnemonic,
  type,
  netId,
  apiUrl,
}: CreateWalletRequest) => {
  const { files } = await list();
  const wallet = create(files?.length || 0, existingMnemonic);

  wallet.meta.netId = netId;
  wallet.meta.remoteApi = apiUrl ? stringifySocketAddress(apiUrl) : '';
  wallet.meta.type = type;

  const walletPath = path.resolve(
    DEFAULT_WALLETS_DIRECTORY,
    `my_wallet_${wallet.meta.created}.json`
  );
  return { path: walletPath, wallet };
};

const subscribe = (context: AppContext) => {
  ipcMain.handle(ipcConsts.READ_WALLET_FILES, list);

  ipcMain.handle(ipcConsts.W_M_BACKUP_WALLET, (_event, filePath: string) =>
    copyWalletFile(filePath, DOCUMENTS_DIR)
      .then((filePath) => ({ error: null, filePath }))
      .catch((error) => ({ error, filePath: null }))
  );

  ipcMain.handle(ipcConsts.W_M_ADD_WALLET_PATH, (_, filePath: string) => {
    const oldWalletFiles = StoreService.get('walletFiles');
    const newWalletFiles = R.uniq([...oldWalletFiles, filePath]);
    StoreService.set('walletFiles', newWalletFiles);
    return newWalletFiles;
  });

  ipcMain.on(ipcConsts.W_M_SHOW_FILE_IN_FOLDER, (_event, request) =>
    showFileInDirectory(context, { ...request })
  );

  ipcMain.on(ipcConsts.W_M_SHOW_DELETE_FILE, (_event, filepath) =>
    deleteWalletFile(context, filepath)
  );

  ipcMain.on(ipcConsts.W_M_WIPE_OUT, () => wipeOut(context));
};

export default { subscribe };
