// Original file: proto/types.proto

import type { TransactionId as _spacemesh_v1_TransactionId, TransactionId__Output as _spacemesh_v1_TransactionId__Output } from '../../spacemesh/v1/TransactionId';

export interface AppEvent {
  'transactionId'?: (_spacemesh_v1_TransactionId | null);
  'message'?: (string);
}

export interface AppEvent__Output {
  'transactionId': (_spacemesh_v1_TransactionId__Output | null);
  'message': (string);
}
