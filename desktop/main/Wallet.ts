import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import * as R from 'ramda';
import { app, dialog, ipcMain } from 'electron';
import Logger from '../logger';
import { ipcConsts } from '../../app/vars';
import {
  KeyPair,
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
import { LOCAL_NODE_API_URL } from '../../shared/constants';
import StoreService from '../storeService';
import { DOCUMENTS_DIR, DEFAULT_WALLETS_DIRECTORY } from './constants';
import { AppContext } from './context';
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
  walletPath,
}: {
  index: number;
  timestamp: string;
  publicKey: string;
  secretKey: string;
  walletPath: string;
}): KeyPair => ({
  displayName: index > 0 ? `Account ${index}` : 'Main Account',
  created: timestamp,
  path: walletPath,
  publicKey,
  secretKey,
});

// Index stands for naming
const create = (index: number, mnemonicSeed?: string): Wallet => {
  const timestamp = getISODate();
  const mnemonic = mnemonicSeed || CryptoService.generateMnemonic();
  const { publicKey, secretKey, walletPath } = CryptoService.deriveNewKeyPair({
    mnemonic,
    index: 0,
  });
  const crypto: WalletSecrets = {
    mnemonic,
    accounts: [
      createAccount({ index: 0, timestamp, publicKey, secretKey, walletPath }),
    ],
    contacts: [],
  };
  const meta: WalletMeta = {
    displayName: index === 0 ? 'Main Wallet' : `Wallet ${index + 1}`,
    created: timestamp,
    type: WalletType.LocalNode,
    genesisID: '',
    remoteApi: '',
    meta: { salt: encryptionConst.DEFAULT_SALT },
  };
  return { meta, crypto };
};

export const createNewAccount = (wallet: Wallet): Wallet => {
  const { meta, crypto } = wallet;
  const timestamp = getISODate();
  const { publicKey, secretKey, walletPath } = CryptoService.deriveNewKeyPair({
    mnemonic: crypto.mnemonic,
    index: crypto.accounts.length,
  });
  const newAccount = createAccount({
    index: crypto.accounts.length,
    timestamp,
    publicKey,
    secretKey,
    walletPath,
  });
  const newCrypto = {
    ...crypto,
    accounts: [...crypto.accounts, newAccount],
  };
  return { meta, crypto: newCrypto };
};

// Pure utils
export const isGenesisIDMissing = (wallet: Wallet) =>
  !wallet?.meta?.genesisID?.length;
export const isApiMissing = (wallet: Wallet) => !wallet.meta.remoteApi;

//
// Subscribe on events
//

export const createWallet = async ({
  existingMnemonic,
  type,
  genesisID,
  apiUrl,
  password,
}: CreateWalletRequest) => {
  const { files } = await list();
  const wallet = create(files?.length || 0, existingMnemonic);

  wallet.meta.genesisID = genesisID;
  wallet.meta.remoteApi =
    apiUrl && apiUrl !== LOCAL_NODE_API_URL
      ? stringifySocketAddress(apiUrl)
      : '';
  wallet.meta.type = type;

  const walletPath = path.resolve(
    DEFAULT_WALLETS_DIRECTORY,
    `my_wallet_${wallet.meta.created}.json`
  );
  return { path: walletPath, wallet, password };
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

  ipcMain.on(ipcConsts.W_M_SHOW_DELETE_FILE, (_event, filepath) =>
    deleteWalletFile(context, filepath)
  );

  ipcMain.on(ipcConsts.W_M_WIPE_OUT, () => wipeOut(context));
};

export default { subscribe };
