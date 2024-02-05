import path from 'path';
import * as R from 'ramda';
import { ipcMain } from 'electron';
import { ipcConsts } from '../../app/vars';
import {
  KeyPair,
  MnemonicOpts,
  MnemonicStrengthType,
  Wallet,
  WalletMeta,
  WalletSecrets,
  WalletType,
} from '../../shared/types';
import { stringifySocketAddress } from '../../shared/utils';
import CryptoService from '../cryptoService';
import { getISODate } from '../../shared/datetime';
import {
  AddWalletResponseType,
  createIpcResponse,
  CreateWalletRequest,
} from '../../shared/ipcMessages';
import StoreService from '../storeService';
import { isMnemonicExisting, isMnemonicNew } from '../../shared/mnemonic';
import { isWalletDuplicate } from '../walletValidation';
import { DOCUMENTS_DIR, DEFAULT_WALLETS_DIRECTORY } from './constants';
import {
  copyWalletFile,
  listWallets,
  loadRawWallet,
  loadRawWallets,
  getWalletFileName,
} from './walletFile';
import { getLocalNodeConnectionConfig } from './utils';
import { showGenericPrompt } from './sendGenericModals';

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

const addWallet = async (
  event: Electron.IpcMainInvokeEvent,
  filePath: string
) => {
  try {
    const oldWalletFiles = StoreService.get('walletFiles');
    const newWalletData = await loadRawWallet(filePath);
    const existingWallets = await loadRawWallets(oldWalletFiles);
    const { isDuplicateName, isDuplicateCipherText } = isWalletDuplicate(
      newWalletData,
      existingWallets
    );
    const isDuplicatePath = oldWalletFiles.includes(filePath);

    if (isDuplicateName || isDuplicateCipherText || isDuplicatePath) {
      let promptMessage = '';

      if (isDuplicateCipherText || isDuplicatePath) {
        promptMessage =
          'This wallet is already opened. Do you want to import it anyway?';
      } else if (isDuplicateName) {
        promptMessage =
          'A different wallet with the same name is already opened in Smapp. Double-check which one you use and consider renaming one of them.';
      }

      const approved = await showGenericPrompt(event.sender, {
        title: 'CONFIRM FILE IMPORT',
        message: promptMessage,
      });

      if (!approved) {
        return createIpcResponse(
          null,
          AddWalletResponseType.DuplicateNotAllowed
        );
      }
    }

    const newWalletFiles = R.uniq([...oldWalletFiles, filePath]);
    StoreService.set('walletFiles', newWalletFiles);
    return createIpcResponse(null, AddWalletResponseType.WalletAdded);
  } catch (err: any) {
    return createIpcResponse(err, null);
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

const subscribe = () => {
  ipcMain.handle(ipcConsts.READ_WALLET_FILES, list);

  ipcMain.handle(ipcConsts.W_M_BACKUP_WALLET, (_event, filePath: string) =>
    copyWalletFile(filePath, DOCUMENTS_DIR)
      .then((filePath) => ({ error: null, filePath }))
      .catch((error) => ({ error, filePath: null }))
  );

  ipcMain.handle(ipcConsts.W_M_ADD_WALLET_PATH, addWallet);
};

export default { subscribe };
