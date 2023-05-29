import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import {
  copyWalletFile,
  decryptWallet,
  encryptWallet,
  listWallets,
  listWalletsByPaths,
  listWalletsInDirectory,
  loadWallet,
  saveWallet,
  updateWalletMeta,
  updateWalletSecrets,
} from '../desktop/main/walletFile';
import {
  Wallet,
  WalletSecrets,
  WalletSecretsEncrypted,
  WalletType,
} from '../shared/types';

const FIXTURES_DIRECTORY = path.resolve(__dirname, './fixtures');
const VALID_WALLET_PATH = path.resolve(
  FIXTURES_DIRECTORY,
  './my_wallet_valid.json'
);

describe('Encryption/Decryption wallet file', () => {
  const secrets: WalletSecrets = {
    mnemonic: 'this is just a test so it does not matter what mnemonics here',
    accounts: [],
    contacts: [],
  };
  const cipher: WalletSecretsEncrypted = {
    cipher: 'AES-128-CTR',
    cipherText:
      '715066e1109e89e8d638e703fdc6038d7bb25a81df6b6d2aebeba26488f7b4b47bc805b61302c125c6998ebcbb15a40c5802e8386c4edbdca832db3d8e1d27c36e68357a840d0cc623a92c498cde40c6205d715013cb5ecd2d676212d6ed2b30061fc85b70890eb2',
  };

  it('encrypts the wallet file', () =>
    expect(encryptWallet(secrets, 'password')).toStrictEqual(cipher));
  it('decrypts the wallet file', () =>
    expect(decryptWallet(cipher, 'password')).toStrictEqual(secrets));
  it('decrypt throws an error in case of wrong password', async () => {
    expect(() => decryptWallet(cipher, 'wrong')).toThrowError('Wrong password');
  });
});

describe('Load wallet file', () => {
  it('loads valid wallet file', async () => {
    const wallet = await loadWallet(VALID_WALLET_PATH, '1');

    expect(wallet).toEqual(
      expect.objectContaining<Wallet>({
        meta: {
          displayName: expect.any(String),
          created: expect.any(String),
          type: expect.stringMatching(
            new RegExp(`^${WalletType.LocalNode}|${WalletType.RemoteApi}$`)
          ),
          netId: expect.any(Number),
          remoteApi: expect.any(String),
          meta: {
            salt: expect.any(String),
          },
        },
        crypto: {
          accounts: expect.arrayContaining([
            expect.objectContaining({
              created: expect.any(String),
              displayName: expect.any(String),
              path: expect.stringMatching(/^\d+\/\d+\/\d+$/),
              publicKey: expect.any(String),
              secretKey: expect.any(String),
            }),
          ]),
          contacts: expect.arrayContaining([]),
          mnemonic: expect.any(String),
        },
      })
    );
  });

  it('throws an error in case of wrong password', async () => {
    const wallet = loadWallet(VALID_WALLET_PATH, 'wr0ng');
    await expect(wallet).rejects.toThrow('Wrong password');
  });
});

describe('Save/update wallet file', () => {
  let outDir: string;
  beforeAll(async () => {
    outDir = await fs.mkdtemp(path.resolve(os.tmpdir(), 'walletFiles-test'));
  });
  afterEach(async () => {
    await fs
      .readdir(outDir)
      .then((files) =>
        Promise.all(files.map((file) => fs.unlink(`${outDir}/${file}`)))
      );
  });
  it('saves wallet file', async () => {
    const wallet = await loadWallet(VALID_WALLET_PATH, '1');
    const { filepath } = await saveWallet(outDir, 'password', wallet);
    const result = await loadWallet(filepath, 'password');

    expect(result).toStrictEqual(wallet);
  });
  it('updates wallet meta', async () => {
    const walletPath = path.resolve(outDir, path.basename(VALID_WALLET_PATH));
    await fs.copyFile(VALID_WALLET_PATH, walletPath);
    const result = await updateWalletMeta(walletPath, {
      displayName: 'It works!',
      netId: 5,
    });
    // Meta updated
    expect(result).toMatchObject({
      meta: {
        displayName: 'It works!',
        netId: 5,
      },
    });
    // And secrets untouched
    const original = await loadWallet(VALID_WALLET_PATH, '1');
    const updatedWallet = await loadWallet(walletPath, '1');
    expect(original.crypto).toStrictEqual(updatedWallet.crypto);
  });
  it('updates encrypted part of wallet', async () => {
    const walletPath = path.resolve(outDir, path.basename(VALID_WALLET_PATH));
    await fs.copyFile(VALID_WALLET_PATH, walletPath);
    await updateWalletSecrets(walletPath, '1', { mnemonic: 'It works!' });

    const original = await loadWallet(VALID_WALLET_PATH, '1');
    const updatedWallet = await loadWallet(walletPath, '1');

    // Secret part is updated
    expect(updatedWallet.crypto.mnemonic).toEqual('It works!');
    // Part of it is untouched
    expect(updatedWallet.crypto.accounts).toStrictEqual(
      original.crypto.accounts
    );
    // Public part of wallet file is untoched
    expect(original.meta).toStrictEqual(updatedWallet.meta);
  });
});

describe('List wallet files', () => {
  const expectWalletList = (length: number, wallets: unknown) => {
    expect(wallets).toHaveLength(length);
    expect(wallets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: VALID_WALLET_PATH,
          meta: expect.objectContaining({
            displayName: 'Main Wallet',
          }),
        }),
      ])
    );
  };

  it('by paths', async () => {
    const wallets = await listWalletsByPaths([
      VALID_WALLET_PATH,
      VALID_WALLET_PATH,
    ]);
    expectWalletList(2, wallets);
  });
  it('within directory', async () => {
    const wallets = await listWalletsInDirectory(FIXTURES_DIRECTORY);
    expectWalletList(1, wallets);
  });
  it('from both sources (returns only unique wallet files)', async () => {
    const wallets = await listWallets(FIXTURES_DIRECTORY, [VALID_WALLET_PATH]);
    expectWalletList(1, wallets);
  });
});

describe('copyWalletFile', () => {
  let tmpDir: string;
  beforeAll(async () => {
    tmpDir = await fs.mkdtemp(path.resolve(os.tmpdir(), 'walletFiles-test'));
  });
  afterEach(async () => {
    await fs
      .readdir(tmpDir)
      .then((files) =>
        Promise.all(files.map((file) => fs.unlink(`${tmpDir}/${file}`)))
      );
  });

  it('copies wallet file & increment name', async () => {
    const copied = await copyWalletFile(VALID_WALLET_PATH, tmpDir);
    expect(copied).toBeTruthy();
    // And couple times more to ensure that it will not overwrite the file
    // But append a counter to the filename
    await copyWalletFile(VALID_WALLET_PATH, tmpDir);
    await copyWalletFile(VALID_WALLET_PATH, tmpDir);

    const files = await fs.readdir(tmpDir);
    expect(files).toHaveLength(3);
  });
});
