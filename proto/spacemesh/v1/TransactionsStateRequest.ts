// Original file: proto/tx_types.proto

import type { TransactionId as _spacemesh_v1_TransactionId, TransactionId__Output as _spacemesh_v1_TransactionId__Output } from '../../spacemesh/v1/TransactionId';

export interface TransactionsStateRequest {
  'transactionId'?: (_spacemesh_v1_TransactionId)[];
  'includeTransactions'?: (boolean);
}

export interface TransactionsStateRequest__Output {
  'transactionId': (_spacemesh_v1_TransactionId__Output)[];
  'includeTransactions': (boolean);
}
