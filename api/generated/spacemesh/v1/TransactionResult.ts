// Original file: vendor/api/spacemesh/v1/tx_types.proto

import type { Transaction as _spacemesh_v1_Transaction, Transaction__Output as _spacemesh_v1_Transaction__Output } from '../../spacemesh/v1/Transaction';
import type { Long } from '@grpc/proto-loader';

// Original file: vendor/api/spacemesh/v1/tx_types.proto

export enum _spacemesh_v1_TransactionResult_Status {
  SUCCESS = 0,
  FAILURE = 1,
  INVALID = 2,
}

export interface TransactionResult {
  'tx'?: (_spacemesh_v1_Transaction | null);
  'status'?: (_spacemesh_v1_TransactionResult_Status | keyof typeof _spacemesh_v1_TransactionResult_Status);
  'message'?: (string);
  'gasConsumed'?: (number | string | Long);
  'fee'?: (number | string | Long);
  'block'?: (Buffer | Uint8Array | string);
  'layer'?: (number);
  'touchedAddresses'?: (string)[];
}

export interface TransactionResult__Output {
  'tx': (_spacemesh_v1_Transaction__Output | null);
  'status': (_spacemesh_v1_TransactionResult_Status);
  'message': (string);
  'gasConsumed': (Long);
  'fee': (Long);
  'block': (Buffer);
  'layer': (number);
  'touchedAddresses': (string)[];
}
