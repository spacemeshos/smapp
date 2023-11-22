// The module is responsible for interaction with wallet files:
// list files, load and save, decrypt and encrypt

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as R from 'ramda';

import {
  Wallet,
  WalletFile,
  WalletMeta,
  WalletSecrets,
  WalletSecretsEncrypted,
  WalletSecretsEncryptedGCM,
  WalletSecretsEncryptedLegacy,
  WalletType,
} from '../../shared/types';
import {
  isWalletFile,
  isWalletGCMEncrypted,
  isWalletLegacyEncrypted,
} from '../../shared/types/guards';
import { fromHexString, toHexString } from '../../shared/utils';
import Warning, {
  WarningType,
  WriteFilePermissionWarningKind,
} from '../../shared/warning';
import {
  constructAesGcmIv,
  decrypt,
  encrypt,
  pbkdf2Key,
  KDF_DKLEN,
  KDF_ITERATIONS,
} from '../aes-gcm';
import FileEncryptionService from '../fileEncryptionService'; // TODO: Remove it in next release
import { isFileExists } from '../utils';
import { getISODate } from '../../shared/datetime';
import { getWalletFileName } from './utils';

export const WRONG_PASSWORD_MESSAGE = 'Wrong password';

const LEGACY_WALLET_META_FIELDS = ['meta', 'netId'];

export const defaultizeWalletMeta = (
  meta: Partial<WalletMeta>
): WalletMeta => ({
  displayName: 'Unknown wallet',
  created: getISODate(),
  genesisID: '',
  remoteApi: '',
  type: WalletType.LocalNode,
  ...R.omit(LEGACY_WALLET_META_FIELDS, meta),
});

export const defaultizeWalletSecrets = (
  secrets: Partial<WalletSecrets>
): WalletSecrets => ({
  accounts: [],
  contacts: [],
  mnemonic: '',
  ...secrets,
});

//
// Encryption
//

const decryptGcm = async (
  crypto: WalletSecretsEncryptedGCM,
  password: string
): Promise<WalletSecrets> => {
  const dc = new TextDecoder();
  const key = await pbkdf2Key(
    password,
    fromHexString(crypto.kdfparams.salt),
    crypto.kdfparams.dklen,
    crypto.kdfparams.iterations
  );
  try {
    const decryptedRaw = dc.decode(
      await decrypt(
        key,
        fromHexString(crypto.cipherParams.iv),
        fromHexString(crypto.cipherText)
      )
    );
    const decrypted = JSON.parse(decryptedRaw) as WalletSecrets;
    return decrypted;
  } catch (err) {
    throw new Error(WRONG_PASSWORD_MESSAGE);
  }
};

// TODO: Remove it next release
const decryptLegacy = (
  crypto: WalletSecretsEncryptedLegacy,
  password: string
): WalletSecrets => {
  const key = FileEncryptionService.createEncryptionKey({ password });
  const decryptedRaw = FileEncryptionService.decryptData({
    data: crypto.cipherText,
    key,
  });
  try {
    const decrypted = JSON.parse(decryptedRaw) as WalletSecrets;
    return decrypted;
  } catch (err) {
    throw new Error(WRONG_PASSWORD_MESSAGE);
  }
};

export const decryptWallet = async (
  crypto: WalletSecretsEncrypted,
  password: string
) => {
  if (isWalletGCMEncrypted(crypto)) {
    return decryptGcm(crypto, password);
  } else {
    return decryptLegacy(crypto, password);
  }
};

export const encryptWallet = async (
  secrets: WalletSecrets,
  password: string
): Promise<WalletSecretsEncryptedGCM> => {
  const ec = new TextEncoder();
  const salt = crypto.randomBytes(16);
  const key = await pbkdf2Key(password, salt);
  const plaintext = ec.encode(JSON.stringify(secrets));
  const iv = await constructAesGcmIv(key, plaintext);
  const cipherText = await encrypt(key, iv, plaintext);
  return {
    cipher: 'AES-GCM',
    cipherText: toHexString(cipherText),
    cipherParams: {
      iv: toHexString(iv),
    },
    kdf: 'PBKDF2',
    kdfparams: {
      dklen: KDF_DKLEN,
      hash: 'SHA-512',
      salt: toHexString(salt),
      iterations: KDF_ITERATIONS,
    },
  };
};

//
// Interactions with FS
//

export const loadRawWallet = async (path: string): Promise<WalletFile> => {
  const fileContent = await fs.readFile(path, { encoding: 'utf8' });
  const content = JSON.parse(fileContent);
  if (!isWalletFile(content)) {
    throw new Error(`File ${path} is not a valid wallet file`);
  }

  return content;
};

export const loadWallet = async (
  path: string,
  password: string
): Promise<Wallet> => {
  const { crypto, meta } = await loadRawWallet(path);
  const cryptoDecoded = await decryptWallet(crypto, password);
  return {
    meta: defaultizeWalletMeta(meta),
    crypto: defaultizeWalletSecrets(cryptoDecoded),
  };
};

const saveRaw = async (walletPath: string, wallet: WalletFile) => {
  const walletName = getWalletFileName(wallet.meta.displayName);
  const filename = path.basename(walletPath);
  const stdFilename = `wallet_${walletName}_${wallet.meta.created}.json`;
  const nextFilename = /^(my_wallet_|wallet_.*_)[\d-TZ.]+\.json$/.test(filename)
    ? stdFilename
    : filename;
  const isFileNameUpdate = nextFilename !== filename;
  const filepath = path.resolve(path.dirname(walletPath), nextFilename);

  try {
    await fs.writeFile(filepath, JSON.stringify(wallet), {
      encoding: 'utf8',
    });

    if (isFileNameUpdate && walletPath) {
      await fs.unlink(path.resolve(walletPath));
    }
  } catch (err: any) {
    throw Warning.fromError(
      WarningType.WriteFilePermission,
      {
        kind: WriteFilePermissionWarningKind.WalletFile,
        filePath: filepath,
      },
      err
    );
  }
  return { filename, filepath };
};

export const saveWallet = async (
  walletPath: string,
  password: string,
  wallet: Wallet
): Promise<{ filename: string; filepath: string }> => {
  const { meta, crypto } = wallet;
  const encrypted = await encryptWallet(crypto, password);
  const fileContent: WalletFile = {
    meta,
    crypto: encrypted,
  };
  return saveRaw(walletPath, fileContent);
};

// TODO: Remove it in next release
export const loadAndMigrateWallet = async (
  path: string,
  password: string
): Promise<Wallet> => {
  const { crypto } = await loadRawWallet(path);
  const wallet = await loadWallet(path, password);
  if (isWalletLegacyEncrypted(crypto)) {
    await saveWallet(path, password, wallet);
  }
  return wallet;
};

export const updateWalletMeta = async (
  path: string,
  meta: Partial<WalletMeta>
) => {
  const wallet = await loadRawWallet(path);
  const newWallet = { ...wallet, meta: { ...wallet.meta, ...meta } };
  return saveRaw(path, newWallet);
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

const findWalletFilesDuplicates = (
  wallets: { path: string; wallet: WalletFile }[]
): Map<string, boolean> => {
  const seen = new Set<string>();
  const duplicatesMap = new Map<string, boolean>();

  wallets.forEach((item) => {
    if (seen.has(item.wallet.meta.displayName)) {
      duplicatesMap.set(item.wallet.meta.displayName, true);
    } else {
      seen.add(item.wallet.meta.displayName);
    }

    if (seen.has(item.wallet.crypto.cipherText)) {
      duplicatesMap.set(item.wallet.crypto.cipherText, true);
    } else {
      seen.add(item.wallet.crypto.cipherText);
    }
  });

  return duplicatesMap;
};

export const listWalletsByPaths = async (files: string[]) => {
  const loadedWallets = await Promise.all(
    files.map(async (filePath) => {
      try {
        const wallet = await loadRawWallet(filePath);
        return { path: filePath, wallet };
      } catch (err) {
        return { path: filePath, error: err };
      }
    })
  ).then(
    // TODO: Show error to the user?
    (res) => R.filter(R.has('wallet'), res)
  );

  const duplicatesMap = findWalletFilesDuplicates(loadedWallets);
  const result = loadedWallets.map((item) => {
    const isNameDuplicate = duplicatesMap.has(item.wallet.meta.displayName);
    const isCipherTextDuplicate = duplicatesMap.has(
      item.wallet.crypto.cipherText
    );

    let duplicateReason = '';

    if (isCipherTextDuplicate) {
      duplicateReason = 'This wallet is already imported.';
    }

    if (isNameDuplicate) {
      duplicateReason =
        'This wallet has the same name as an already imported wallet.';
    }

    return {
      path: item.path,
      meta: item.wallet.meta,
      isDuplicate: isNameDuplicate || isCipherTextDuplicate,
      duplicateReason,
    };
  });
  return result;
};

export const listWalletsInDirectory = async (walletsDir: string) => {
  const files = await fs.readdir(walletsDir);
  const regex = new RegExp('(wallet_).*.(json)', 'i');
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
