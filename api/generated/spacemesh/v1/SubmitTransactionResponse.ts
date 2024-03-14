// Original file: vendor/api/spacemesh/v1/tx_types.proto

import type { Status as _google_rpc_Status, Status__Output as _google_rpc_Status__Output } from '../../google/rpc/Status';
import type { TransactionState as _spacemesh_v1_TransactionState, TransactionState__Output as _spacemesh_v1_TransactionState__Output } from '../../spacemesh/v1/TransactionState';

export interface SubmitTransactionResponse {
  'status'?: (_google_rpc_Status | null);
  'txstate'?: (_spacemesh_v1_TransactionState | null);
}

export interface SubmitTransactionResponse__Output {
  'status': (_google_rpc_Status__Output | null);
  'txstate': (_spacemesh_v1_TransactionState__Output | null);
}
