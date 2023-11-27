import os from 'os';
import path from 'path';
import { promises as fs } from 'fs';
import {
  copyWalletFile,
  decryptWallet,
  encryptWallet,
  listWallets,
  listWalletsInDirectory,
  listWalletsMetaByPaths,
  loadRawWallet,
  loadWallet,
  saveWallet,
  updateWalletMeta,
  updateWalletSecrets,
} from '../desktop/main/walletFile';
import {
  Wallet,
  WalletSecrets,
  WalletSecretsEncryptedGCM,
  WalletSecretsEncryptedLegacy,
  WalletType,
} from '../shared/types';

const FIXTURES_DIRECTORY = path.resolve(__dirname, './fixtures');
const LEGACY_WALLET_PATH = path.resolve(
  FIXTURES_DIRECTORY,
  './my_wallet_legacy.json'
);
const GCM_WALLET_PATH = path.resolve(
  FIXTURES_DIRECTORY,
  './my_wallet_gcm.json'
);

const LEGACY_NOT_VALID_WALLET_PATH = path.resolve(
  FIXTURES_DIRECTORY,
  './my_wallet_legacy_not_valid.json'
);
const GCM_NOT_VALID_WALLET_PATH = path.resolve(
  FIXTURES_DIRECTORY,
  './my_wallet_gcm_not_valid.json'
);

// For update wallet test
jest.setTimeout(30000);

describe('Encryption/Decryption wallet file', () => {
  const secrets: WalletSecrets = {
    mnemonic: 'this is just a test so it does not matter what mnemonics here',
    accounts: [],
    contacts: [],
  };
  const cipher: WalletSecretsEncryptedLegacy = {
    cipher: 'AES-128-CTR',
    cipherText:
      '715066e1109e89e8d638e703fdc6038d7bb25a81df6b6d2aebeba26488f7b4b47bc805b61302c125c6998ebcbb15a40c5802e8386c4edbdca832db3d8e1d27c36e68357a840d0cc623a92c498cde40c6205d715013cb5ecd2d676212d6ed2b30061fc85b70890eb2',
  };

  const cipher2: WalletSecretsEncryptedGCM = {
    cipher: 'AES-GCM',
    cipherText:
      '5d1877a1e2c65ee3f894e7100c434770702fa29402b548438b8fbcdb37a76ca1dff4151a84984ba889a9efc564580b6278619e7bba17902405b05170a3407b63e640f1e68f97a02e60c917e806b3f761a1c8c29e66d856406f4eeacaedd50ba3f0f896011aa4d312c1636305b8175b1bb26ea827368af738',
    cipherParams: {
      iv: '49c842e8b787923f9b4e7dc5',
    },
    kdf: 'PBKDF2',
    kdfparams: {
      dklen: 256,
      hash: 'SHA-512',
      salt: '99d1b77e562446a65f0aa031d476df5b',
      iterations: 120000,
    },
  };

  const PASSWORD = 'password';

  it('encrypts the wallet file (GCM)', async () => {
    const encrypted = await encryptWallet(secrets, PASSWORD);
    expect(encrypted).toHaveProperty('cipherText');
    expect(encrypted).toHaveProperty('cipherParams');
    expect(encrypted).toHaveProperty('kdf');
    // Since every GCM encryption creates new random salt
    // the only way to ensure that it is encrypted correctly
    // is to decrypt it afterward and compare secrets
    expect(await decryptWallet(encrypted, PASSWORD)).toEqual(secrets);
  });
  it('decrypts the wallet file (legacy CTR)', async () =>
    expect(await decryptWallet(cipher, PASSWORD)).toStrictEqual(secrets));
  it('decrypts the wallet file (GCM)', async () =>
    expect(await decryptWallet(cipher2, PASSWORD)).toStrictEqual(secrets));
  it('decrypt throws an error in case of wrong password', async () => {
    expect.assertions(2);
    // Legacy CTR
    await decryptWallet(cipher, 'wrong').catch((err) =>
      expect(err.message).toMatch('Wrong password')
    );
    // GCM
    await decryptWallet(cipher2, 'wrong').catch((err) =>
      expect(err.message).toMatch('Wrong password')
    );
  });
});

describe('Load wallet file', () => {
  it('loads valid wallet file', async () => {
    const wallet = await loadWallet(LEGACY_WALLET_PATH, '1');

    expect(wallet).toEqual(
      expect.objectContaining<Wallet>({
        meta: {
          displayName: expect.any(String),
          created: expect.any(String),
          type: expect.stringMatching(
            new RegExp(`^${WalletType.LocalNode}|${WalletType.RemoteApi}$`)
          ),
          genesisID: expect.any(String),
          remoteApi: expect.any(String),
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
    const wallet = loadWallet(LEGACY_WALLET_PATH, 'wr0ng');
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
    const wallet = await loadWallet(LEGACY_WALLET_PATH, '1');
    const output = path.resolve(outDir, path.basename(LEGACY_WALLET_PATH));
    const { filepath } = await saveWallet(output, 'password', wallet);
    const result = await loadWallet(filepath, 'password');

    expect(result).toStrictEqual(wallet);
  });
  it('updates wallet meta', async () => {
    const walletPath = path.resolve(outDir, path.basename(LEGACY_WALLET_PATH));
    await fs.copyFile(LEGACY_WALLET_PATH, walletPath);
    const { filepath } = await updateWalletMeta(walletPath, {
      displayName: 'It works!',
      genesisID: '0x91d338938929ec38e320ba558b6bd8538eae9753',
    });

    const result = await loadWallet(filepath, '1');
    // Meta updated
    expect(result).toMatchObject({
      meta: {
        displayName: 'It works!',
        genesisID: '0x91d338938929ec38e320ba558b6bd8538eae9753',
      },
    });
    // And secrets untouched
    const original = await loadWallet(LEGACY_WALLET_PATH, '1');
    const updatedWallet = await loadWallet(walletPath, '1');
    expect(original.crypto).toStrictEqual(updatedWallet.crypto);
  });
  it('updates encrypted part of wallet', async () => {
    const walletPath = path.resolve(outDir, path.basename(LEGACY_WALLET_PATH));
    await fs.copyFile(LEGACY_WALLET_PATH, walletPath);
    await updateWalletSecrets(walletPath, '1', { mnemonic: 'It works!' });

    const original = await loadWallet(LEGACY_WALLET_PATH, '1');
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
          path: LEGACY_WALLET_PATH,
          meta: expect.objectContaining({
            displayName: 'Wallet Legacy',
          }),
        }),
        expect.objectContaining({
          path: GCM_WALLET_PATH,
          meta: expect.objectContaining({
            displayName: 'Wallet GCM',
          }),
        }),
      ])
    );
  };

  it('by paths', async () => {
    const wallets = await listWalletsMetaByPaths([
      LEGACY_WALLET_PATH,
      LEGACY_WALLET_PATH,
      GCM_WALLET_PATH,
    ]);
    expectWalletList(3, wallets);
  });
  it('within directory', async () => {
    const wallets = await listWalletsInDirectory(FIXTURES_DIRECTORY);
    expectWalletList(2, wallets);
  });
  it('from both sources (returns only unique wallet files)', async () => {
    const wallets = await listWallets(FIXTURES_DIRECTORY, [LEGACY_WALLET_PATH]);
    expectWalletList(2, wallets);
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
    const copied = await copyWalletFile(LEGACY_WALLET_PATH, tmpDir);
    expect(copied).toBeTruthy();
    // And couple times more to ensure that it will not overwrite the file
    // But append a counter to the filename
    await copyWalletFile(LEGACY_WALLET_PATH, tmpDir);
    await copyWalletFile(LEGACY_WALLET_PATH, tmpDir);

    const files = await fs.readdir(tmpDir);
    expect(files).toHaveLength(3);
  });
});

describe('Load and validate wallet', () => {
  it('load and validate a valid wallets', async () => {
    await expect(loadRawWallet(LEGACY_WALLET_PATH)).resolves.not.toThrow();
    await expect(loadRawWallet(GCM_WALLET_PATH)).resolves.not.toThrow();
  });

  it('load and validate a not valid wallets', async () => {
    await expect(
      loadRawWallet(LEGACY_NOT_VALID_WALLET_PATH)
    ).rejects.toThrowError(/not a valid wallet file/);
    await expect(loadRawWallet(GCM_NOT_VALID_WALLET_PATH)).rejects.toThrowError(
      /not a valid wallet file/
    );
  });
});
