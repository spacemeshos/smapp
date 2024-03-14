// Original file: vendor/api/spacemesh/v1/tx_types.proto

import type { TransactionId as _spacemesh_v1_TransactionId, TransactionId__Output as _spacemesh_v1_TransactionId__Output } from '../../spacemesh/v1/TransactionId';

export interface TransactionsStateStreamRequest {
  'transactionId'?: (_spacemesh_v1_TransactionId)[];
  'includeTransactions'?: (boolean);
}

export interface TransactionsStateStreamRequest__Output {
  'transactionId': (_spacemesh_v1_TransactionId__Output)[];
  'includeTransactions': (boolean);
}
