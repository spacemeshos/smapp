// Original file: vendor/api/spacemesh/v1/tx_types.proto

import type { TransactionState as _spacemesh_v1_TransactionState, TransactionState__Output as _spacemesh_v1_TransactionState__Output } from '../../spacemesh/v1/TransactionState';
import type { Transaction as _spacemesh_v1_Transaction, Transaction__Output as _spacemesh_v1_Transaction__Output } from '../../spacemesh/v1/Transaction';

export interface TransactionsStateStreamResponse {
  'transactionState'?: (_spacemesh_v1_TransactionState | null);
  'transaction'?: (_spacemesh_v1_Transaction | null);
}

export interface TransactionsStateStreamResponse__Output {
  'transactionState': (_spacemesh_v1_TransactionState__Output | null);
  'transaction': (_spacemesh_v1_Transaction__Output | null);
}
