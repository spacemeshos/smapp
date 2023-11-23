import { Object } from 'ts-toolbelt';
import { Reward__Output } from '../../proto/spacemesh/v1/Reward';
import { Transaction__Output } from '../../proto/spacemesh/v1/Transaction';
import { TransactionState__Output } from '../../proto/spacemesh/v1/TransactionState';
import { NodeError } from './node';
import { Tx, Reward, Activation } from './tx';
import {
  WalletFile,
  WalletMeta,
  WalletSecrets,
  WalletSecretsEncrypted,
  WalletSecretsEncryptedGCM,
  WalletSecretsEncryptedLegacy,
  WalletWithPath,
} from './wallet';

// GRPC Type guards
export const hasRequiredTxFields = (
  tx: Transaction__Output
): tx is Object.NonNullable<Transaction__Output, 'principal' | 'template'> =>
  !!tx.id && !!tx.principal?.address && !!tx.template?.address;

export const hasRequiredTxStateFields = (
  txState: TransactionState__Output
): txState is Object.NonNullable<TransactionState__Output, 'id' | 'state'> =>
  !!txState.id?.id && txState.state !== undefined;

export const hasRequiredRewardFields = (
  r: any
): r is Object.NonNullable<
  Reward__Output,
  'coinbase' | 'total' | 'layer' | 'layerReward' | 'layerComputed' | 'smesher'
> =>
  !!(
    r &&
    r.coinbase?.address &&
    r.total?.value &&
    r.layer?.number &&
    r.layerReward?.value
  );

// Own Type guards
export const isTx = (a: any): a is Tx =>
  Boolean(a && a.id && a.principal && a.template && a.method && a.payload);

export const isReward = (a: any): a is Reward =>
  a &&
  typeof a.coinbase === 'string' &&
  typeof a.layer === 'number' &&
  typeof a.amount === 'number';

export const isActivation = (a: any): a is Activation =>
  Boolean(a && a.id && a.layer && a.smesherId && a.coinbase && a.numUnits);

export const isNodeError = (a: any): a is NodeError =>
  Boolean(a && a.msg && a.module && a.level);

export const isWalletSecretsEncrypted = (a: any): a is WalletSecretsEncrypted =>
  Boolean(a && a.cipher && a.cipherText);

export const isWalletGCMEncrypted = (a: any): a is WalletSecretsEncryptedGCM =>
  isWalletSecretsEncrypted(a) &&
  a.cipher === 'AES-GCM' &&
  typeof a.cipherParams?.iv === 'string' &&
  a.kdf === 'PBKDF2' &&
  typeof a.kdfparams?.dklen === 'number' &&
  typeof a.kdfparams?.hash === 'string' &&
  typeof a.kdfparams?.iterations === 'number' &&
  typeof a.kdfparams?.salt === 'string';

export const isWalletLegacyEncrypted = (
  a: any
): a is WalletSecretsEncryptedLegacy =>
  isWalletSecretsEncrypted(a) && a.cipher === 'AES-128-CTR';

export const isWalletSecrets = (a: any): a is WalletSecrets =>
  Boolean(a && a.mnemonic && a.accounts && a.contacts);

export const isWalletMeta = (meta: WalletMeta) =>
  typeof meta.displayName === 'string' && typeof meta.created === 'string';

export const isWalletFile = (wallet: any): wallet is WalletFile =>
  wallet &&
  isWalletMeta(wallet.meta) &&
  (isWalletGCMEncrypted(wallet.crypto) ||
    isWalletLegacyEncrypted(wallet.crypto));

export const validationWalletCipherTextDuplication = (
  loadedWallets: WalletWithPath[],
  cipherText: string
): string => {
  const duplicateWallet = loadedWallets.find(
    (wallet) => wallet.wallet.crypto.cipherText === cipherText
  );
  return duplicateWallet
    ? `Duplicate wallet detected: it seems the wallet duplicates the wallet at ${duplicateWallet.path}.`
    : '';
};
export interface WalletWithValidationDetails extends WalletWithPath {
  isDuplicate: boolean;
  duplicateReason: string;
}
export const validateWalletsForList = (
  wallets: WalletWithPath[]
): WalletWithValidationDetails[] =>
  wallets.map((walletWithPath, index) => {
    const nameDuplicateWallet = wallets.find(
      (w, i) =>
        i !== index &&
        w.wallet.meta.displayName === walletWithPath.wallet.meta.displayName
    );
    const cipherTextDuplicateWallet = wallets.find(
      (w, i) =>
        i !== index &&
        w.wallet.crypto.cipherText === walletWithPath.wallet.crypto.cipherText
    );

    return {
      ...walletWithPath,
      isDuplicate: !!(nameDuplicateWallet || cipherTextDuplicateWallet),
      // eslint-disable-next-line no-nested-ternary
      duplicateReason: nameDuplicateWallet
        ? `Duplicate wallet name detected: wallet has the same wallet name as the wallet at \n'${nameDuplicateWallet?.path}'.`
        : cipherTextDuplicateWallet
        ? `Duplicate wallet detected: it seems the wallet duplicates the wallet at ${cipherTextDuplicateWallet.path}.`
        : '',
    };
  });
