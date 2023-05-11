// Original file: proto/tx_types.proto

import type { Transaction as _spacemesh_v1_Transaction, Transaction__Output as _spacemesh_v1_Transaction__Output } from '../../spacemesh/v1/Transaction';

export interface ParseTransactionResponse {
  'tx'?: (_spacemesh_v1_Transaction | null);
}

export interface ParseTransactionResponse__Output {
  'tx': (_spacemesh_v1_Transaction__Output | null);
}
