import path from 'path';
import * as R from 'ramda';
import { ipcMain } from 'electron';
import { ipcConsts } from '../../app/vars';
import {
  KeyPair,
  MnemonicOpts,
  MnemonicStrengthType,
  Wallet,
  WalletFile,
  WalletMeta,
  WalletSecrets,
  WalletType,
} from '../../shared/types';
import { stringifySocketAddress } from '../../shared/utils';
import CryptoService from '../cryptoService';
import { getISODate } from '../../shared/datetime';
import {
  createIpcResponse,
  CreateWalletRequest,
} from '../../shared/ipcMessages';
import StoreService from '../storeService';
import { isMnemonicExisting, isMnemonicNew } from '../../shared/mnemonic';
import { DOCUMENTS_DIR, DEFAULT_WALLETS_DIRECTORY } from './constants';
import {
  copyWalletFile,
  listWallets,
  loadRawWallet,
  loadRawWallets,
} from './walletFile';
import { getLocalNodeConnectionConfig, getWalletFileName } from './utils';

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

const DEFAULT_MNEMONIC_STRENGTH_TYPE: MnemonicStrengthType = 12;
// Index stands for naming
const create = (
  index: number,
  mnemonicOpts: MnemonicOpts,
  name?: string
): Wallet => {
  const timestamp = getISODate();
  const mnemonic = isMnemonicExisting(mnemonicOpts)
    ? mnemonicOpts.existing
    : CryptoService.generateMnemonic(
        isMnemonicNew(mnemonicOpts)
          ? mnemonicOpts.strength
          : DEFAULT_MNEMONIC_STRENGTH_TYPE
      );
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
    displayName: name || (index === 0 ? 'Main Wallet' : `Wallet ${index + 1}`),
    created: timestamp,
    type: WalletType.LocalNode,
    genesisID: '',
    remoteApi: '',
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
function isDuplicateByName(
  newWalletData: WalletFile,
  existingWallets: { path: string; wallet: WalletFile }[]
) {
  const existingWalletNames = new Set(
    existingWallets.map(({ wallet }) => wallet.meta.displayName)
  );
  return existingWalletNames.has(newWalletData.meta.displayName);
}
function isDuplicateByCipherText(
  newWalletData: WalletFile,
  existingWallets: { path: string; wallet: WalletFile }[]
) {
  const existingWalletCiphertexts = new Set(
    existingWallets.map(({ wallet }) => wallet.crypto.cipherText)
  );
  return existingWalletCiphertexts.has(newWalletData.crypto.cipherText);
}

//
// Subscribe on events
//

export const createWallet = async ({
  type,
  genesisID,
  apiUrl,
  password,
  name,
  mnemonic,
}: CreateWalletRequest) => {
  const { files } = await list();
  const wallet = create(files?.length || 0, mnemonic, name);

  wallet.meta.genesisID = genesisID;
  wallet.meta.remoteApi =
    apiUrl && apiUrl !== getLocalNodeConnectionConfig()
      ? stringifySocketAddress(apiUrl)
      : '';
  wallet.meta.type = type;
  const walletName = getWalletFileName(wallet.meta.displayName);

  const walletPath = path.resolve(
    DEFAULT_WALLETS_DIRECTORY,
    `wallet_${walletName}_${wallet.meta.created}.json`
  );
  return { path: walletPath, wallet, password };
};

function sendApproveAddWalletRequest(
  event: Electron.IpcMainInvokeEvent,
  payload: {
    isDuplicateName: boolean;
    isDuplicateWallet: boolean;
    isDuplicatePathInStore: boolean;
  }
) {
  event.sender.send(ipcConsts.W_M_APPROVE_ADD_WALLET_REQUEST, payload);
  return new Promise((resolve) =>
    ipcMain.once(ipcConsts.W_M_APPROVE_ADD_WALLET_RESPONSE, (_, userResponse) =>
      resolve(userResponse)
    )
  );
}

const subscribe = () => {
  ipcMain.handle(ipcConsts.READ_WALLET_FILES, list);

  ipcMain.handle(ipcConsts.W_M_BACKUP_WALLET, (_event, filePath: string) =>
    copyWalletFile(filePath, DOCUMENTS_DIR)
      .then((filePath) => ({ error: null, filePath }))
      .catch((error) => ({ error, filePath: null }))
  );

  ipcMain.handle(ipcConsts.W_M_ADD_WALLET_PATH, async (event, filePath) => {
    try {
      const oldWalletFiles = StoreService.get('walletFiles');
      const newWalletData = await loadRawWallet(filePath);
      const existingWallets = await loadRawWallets(oldWalletFiles);
      const isDuplicateName = isDuplicateByName(newWalletData, existingWallets);
      const isDuplicateWallet = isDuplicateByCipherText(
        newWalletData,
        existingWallets
      );
      const isDuplicatePathInStore = oldWalletFiles.includes(filePath);
      const isDuplicate =
        isDuplicateName || isDuplicateWallet || isDuplicatePathInStore;

      if (isDuplicate) {
        const approved = await sendApproveAddWalletRequest(event, {
          isDuplicateName,
          isDuplicateWallet,
          isDuplicatePathInStore,
        });

        if (!approved) {
          return createIpcResponse(null, { status: false });
        }
      }

      const newWalletFiles = R.uniq([...oldWalletFiles, filePath]);
      StoreService.set('walletFiles', newWalletFiles);
      return createIpcResponse(null, { status: true });
    } catch (err: any) {
      return createIpcResponse(err, null);
    }
  });
};

export default { subscribe };
