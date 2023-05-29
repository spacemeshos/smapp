import { Object } from 'ts-toolbelt';
import { Reward__Output } from '../../proto/spacemesh/v1/Reward';
import { Transaction__Output } from '../../proto/spacemesh/v1/Transaction';
import { TransactionState__Output } from '../../proto/spacemesh/v1/TransactionState';
import { NodeError } from './node';
import { Tx, Reward, Activation } from './tx';
import {
  WalletSecrets,
  WalletSecretsEncrypted,
  WalletSecretsEncryptedGCM,
  WalletSecretsEncryptedLegacy,
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
  a && a.id && a.principal && a.template && a.method && a.payload;

export const isReward = (a: any): a is Reward =>
  a &&
  typeof a.coinbase === 'string' &&
  typeof a.layer === 'number' &&
  typeof a.amount === 'number';

export const isActivation = (a: any): a is Activation =>
  a && a.id && a.layer && a.smesherId && a.coinbase && a.numUnits;

export const isNodeError = (a: any): a is NodeError =>
  a && a.msg && a.module && a.level;

export const isWalletSecretsEncrypted = (a: any): a is WalletSecretsEncrypted =>
  a && a.cipher && a.cipherText;

export const isWalletGCMEncrypted = (a: any): a is WalletSecretsEncryptedGCM =>
  isWalletSecretsEncrypted(a) && a.cipher === 'AES-GCM';

export const isWalletLegacyEncrypted = (
  a: any
): a is WalletSecretsEncryptedLegacy =>
  isWalletSecretsEncrypted(a) && a.cipher === 'AES-128-CTR';

export const isWalletSecrets = (a: any): a is WalletSecrets =>
  a && a.mnemonic && a.accounts && a.contacts;
