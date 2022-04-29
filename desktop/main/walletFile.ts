// The module is responsible for interaction with wallet files:
// list files, load and save, decrypt and encrypt

import { promises as fs } from 'fs';
import path from 'path';
import * as R from 'ramda';

import {
  Wallet,
  WalletFile,
  WalletMeta,
  WalletSecrets,
  WalletSecretsEncrypted,
} from '../../shared/types';
import FileEncryptionService from '../fileEncryptionService';
import { isFileExists } from '../utils';
import { DEFAULT_WALLETS_DIRECTORY } from './constants';

//
// Encryption
//

export const decryptWallet = (
  crypto: WalletSecretsEncrypted,
  password: string
): WalletSecrets => {
  const key = FileEncryptionService.createEncryptionKey({ password });
  const decryptedRaw = FileEncryptionService.decryptData({
    data: crypto.cipherText,
    key,
  });
  try {
    const decrypted = JSON.parse(decryptedRaw) as WalletSecrets; // TODO: Add validation
    return decrypted;
  } catch (err) {
    throw new Error('Wrong password');
  }
};

export const encryptWallet = (
  cryptoDecrypted: WalletSecrets,
  password: string
): WalletSecretsEncrypted => {
  const key = FileEncryptionService.createEncryptionKey({ password });
  const encrypted = FileEncryptionService.encryptData({
    data: JSON.stringify(cryptoDecrypted),
    key,
  });
  return { cipher: 'AES-128-CTR', cipherText: encrypted };
};

//
// Interactions with FS
//

export const loadRawWallet = async (path: string): Promise<WalletFile> => {
  const fileContent = await fs.readFile(path, { encoding: 'utf8' });
  return JSON.parse(fileContent) as WalletFile;
};

export const loadWallet = async (
  path: string,
  password: string
): Promise<Wallet> => {
  const { crypto, meta } = await loadRawWallet(path);
  const cryptoDecoded = decryptWallet(crypto, password);
  return { meta, crypto: cryptoDecoded };
};

export const saveRaw = async (walletPath: string, wallet: WalletFile) => {
  const isFilePath = walletPath.endsWith('.json');
  const filename = isFilePath
    ? path.basename(walletPath)
    : `my_wallet_${wallet.meta.created}.json`;
  const filepath = isFilePath ? walletPath : path.resolve(walletPath, filename);
  await fs.writeFile(filepath, JSON.stringify(wallet), { encoding: 'utf8' });
  return { filename, filepath };
};

export const saveWallet = (
  walletPath: string,
  password: string,
  wallet: Wallet
): Promise<{ filename: string; filepath: string }> => {
  const { meta, crypto } = wallet;
  const encrypted = encryptWallet(crypto, password);
  const fileContent: WalletFile = {
    meta,
    crypto: encrypted,
  };
  return saveRaw(walletPath, fileContent);
};

export const updateWalletMeta = async (
  path: string,
  meta: Partial<WalletMeta>
) => {
  const wallet = await loadRawWallet(path);
  const newWallet = { ...wallet, meta: { ...wallet.meta, ...meta } };
  await saveRaw(path, newWallet);
  return newWallet;
};

export const updateWalletSecrets = async (
  path: string,
  password: string,
  crypto: Partial<WalletSecrets>
) => {
  const wallet = await loadWallet(path, password);
  const newWallet = { ...wallet, crypto: { ...wallet.crypto, ...crypto } };
  await saveWallet(path, password, newWallet);
  return newWallet;
};

export const copyWalletFile = async (filePath: string, outputDir: string) => {
  const originalFilename = path.basename(filePath);
  const formatFilename = (filename: string, n: number) => {
    if (n === 0) return filename;
    const f = path.parse(filename);
    return `${f.name}-copy-${n}${f.ext}`;
  };
  const getOutputFileName = async (
    filename: string,
    n = 0
  ): Promise<string> => {
    const newFileName = formatFilename(filename, n);
    const outputFilePath = path.resolve(outputDir, newFileName);
    const isExist = await isFileExists(outputFilePath);
    return isExist ? getOutputFileName(filename, n + 1) : newFileName;
  };
  const newFilePath = path.resolve(
    outputDir,
    await getOutputFileName(originalFilename, 0)
  );
  await fs.copyFile(filePath, newFilePath);
  return newFilePath;
};

export const listWalletsByPaths = (files: string[]) =>
  Promise.all(
    files.map(async (filePath) => {
      const wallet = await loadRawWallet(filePath);
      return { path: filePath, meta: wallet.meta };
    })
  );

export const listWalletsInDirectory = async (
  walletsDir: string = DEFAULT_WALLETS_DIRECTORY
) => {
  const files = await fs.readdir(walletsDir);
  const regex = new RegExp('(my_wallet_).*.(json)', 'i');
  const walletFiles = files
    .filter((filename) => filename.match(regex))
    .map((filename) => path.join(walletsDir, filename));
  return listWalletsByPaths(walletFiles);
};

export const listWallets = async (
  walletsDir: string,
  walletPaths: string[]
) => {
  const storedWalletPaths = R.uniq(walletPaths);
  return R.uniqBy(R.prop('path'), [
    ...(await listWalletsByPaths(storedWalletPaths)),
    ...(await listWalletsInDirectory(walletsDir)),
  ]);
};
