import { Object } from 'ts-toolbelt';
import { Reward__Output } from '../../proto/spacemesh/v1/Reward';
import { Transaction__Output } from '../../proto/spacemesh/v1/Transaction';
import { TransactionState__Output } from '../../proto/spacemesh/v1/TransactionState';
import { NodeConfig, NodeError } from './node';
import { Tx, Reward, Activation } from './tx';
import {
  WalletFile,
  WalletMeta,
  WalletSecrets,
  WalletSecretsEncrypted,
  WalletSecretsEncryptedGCM,
  WalletSecretsEncryptedLegacy,
} from './wallet';
import { Network } from './misc';

// Utils
export const notEmptyString = (a: any): a is string =>
  typeof a === 'string' && a.length > 0;

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

export const isNetwork = (net: any): net is Network =>
  !!net &&
  notEmptyString(net.netName) &&
  notEmptyString(net.conf) &&
  notEmptyString(net.dash) &&
  notEmptyString(net.explorer) &&
  notEmptyString(net.minSmappRelease) &&
  notEmptyString(net.latestSmappRelease) &&
  notEmptyString(net.smappBaseDownloadUrl);

export const isNetConfig = (c: any): c is NodeConfig =>
  !!c &&
  c.main &&
  notEmptyString(c.main['layer-duration']) &&
  c.main['layers-per-epoch'] > 0 &&
  c.post &&
  c.post['post-labels-per-unit'] > 0 &&
  c.post['post-max-numunits'] > 0 &&
  notEmptyString(c.poet?.['cycle-gap']) &&
  notEmptyString(c.genesis?.['genesis-time']) &&
  notEmptyString(c.genesis?.['genesis-extra-data']);
