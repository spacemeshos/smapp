import { Object } from 'ts-toolbelt';
import { Reward__Output } from '../../proto/spacemesh/v1/Reward';
import { Transaction__Output } from '../../proto/spacemesh/v1/Transaction';
import { TransactionState__Output } from '../../proto/spacemesh/v1/TransactionState';
import { NodeError } from './node';
import { Tx, Reward, Activation, SmesherReward } from './tx';
import { WalletSecrets, WalletSecretsEncrypted } from './wallet';

// GRPC Type guards
export const hasRequiredTxFields = (
  tx: Transaction__Output
): tx is Object.NonNullable<Transaction__Output, 'id' | 'amount' | 'sender'> =>
  !!tx.id?.id && !!tx.amount?.value && !!tx.sender?.address;

export const hasRequiredTxStateFields = (
  txState: TransactionState__Output
): txState is Object.NonNullable<TransactionState__Output, 'id' | 'state'> =>
  !!txState.id?.id && txState.state !== undefined;

export const hasRequiredRewardFields = (
  r: Reward__Output
): r is Object.NonNullable<
  Reward__Output,
  'coinbase' | 'total' | 'layer' | 'layerReward' | 'layerComputed' | 'smesher'
> =>
  !!(
    r.coinbase?.address &&
    r.smesher?.id &&
    r.total?.value &&
    r.layer?.number &&
    r.layerReward?.value
  );

// Own Type guards
export const isTx = (a: any): a is Tx =>
  a && a.id && a.sender && a.receiver && a.amount;

export const isReward = (a: any): a is Reward =>
  a && a.layer && a.coinbase && a.smesher && a.amount;

export const isSmesherReward = (a: any): a is SmesherReward =>
  a && a.layer && a.coinbase && a.smesher && a.total;

export const isActivation = (a: any): a is Activation =>
  a && a.id && a.layer && a.smesherId && a.coinbase && a.numUnits;

export const isNodeError = (a: any): a is NodeError =>
  a && a.msg && a.module && a.level;

export const isWalletSecretsEncrypted = (a: any): a is WalletSecretsEncrypted =>
  a && a.cipher && a.cipherText;

export const isWalletSecrets = (a: any): a is WalletSecrets =>
  a && a.mnemonic && a.accounts && a.contacts;
