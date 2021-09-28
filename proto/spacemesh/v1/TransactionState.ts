// Original file: proto/tx_types.proto

import type { TransactionId as _spacemesh_v1_TransactionId, TransactionId__Output as _spacemesh_v1_TransactionId__Output } from '../../spacemesh/v1/TransactionId';

// Original file: proto/tx_types.proto

export enum _spacemesh_v1_TransactionState_TransactionState {
  TRANSACTION_STATE_UNSPECIFIED = 0,
  TRANSACTION_STATE_REJECTED = 1,
  TRANSACTION_STATE_INSUFFICIENT_FUNDS = 2,
  TRANSACTION_STATE_CONFLICTING = 3,
  TRANSACTION_STATE_MEMPOOL = 4,
  TRANSACTION_STATE_MESH = 5,
  TRANSACTION_STATE_PROCESSED = 6,
}

export interface TransactionState {
  'id'?: (_spacemesh_v1_TransactionId | null);
  'state'?: (_spacemesh_v1_TransactionState_TransactionState | keyof typeof _spacemesh_v1_TransactionState_TransactionState);
}

export interface TransactionState__Output {
  'id': (_spacemesh_v1_TransactionId__Output | null);
  'state': (_spacemesh_v1_TransactionState_TransactionState);
}
