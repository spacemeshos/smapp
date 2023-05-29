// Original file: proto/tx_types.proto

import type { TransactionState as _spacemesh_v1_TransactionState, TransactionState__Output as _spacemesh_v1_TransactionState__Output } from '../../spacemesh/v1/TransactionState';
import type { Transaction as _spacemesh_v1_Transaction, Transaction__Output as _spacemesh_v1_Transaction__Output } from '../../spacemesh/v1/Transaction';

export interface TransactionsStateResponse {
  'transactionsState'?: (_spacemesh_v1_TransactionState)[];
  'transactions'?: (_spacemesh_v1_Transaction)[];
}

export interface TransactionsStateResponse__Output {
  'transactionsState': (_spacemesh_v1_TransactionState__Output)[];
  'transactions': (_spacemesh_v1_Transaction__Output)[];
}
