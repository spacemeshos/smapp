// Original file: vendor/api/spacemesh/v1/global_state_types.proto

import type { TransactionId as _spacemesh_v1_TransactionId, TransactionId__Output as _spacemesh_v1_TransactionId__Output } from '../../spacemesh/v1/TransactionId';
import type { Amount as _spacemesh_v1_Amount, Amount__Output as _spacemesh_v1_Amount__Output } from '../../spacemesh/v1/Amount';
import type { LayerNumber as _spacemesh_v1_LayerNumber, LayerNumber__Output as _spacemesh_v1_LayerNumber__Output } from '../../spacemesh/v1/LayerNumber';
import type { Long } from '@grpc/proto-loader';

// Original file: vendor/api/spacemesh/v1/global_state_types.proto

export enum _spacemesh_v1_TransactionReceipt_TransactionResult {
  TRANSACTION_RESULT_UNSPECIFIED = 0,
  TRANSACTION_RESULT_EXECUTED = 1,
  TRANSACTION_RESULT_BAD_COUNTER = 2,
  TRANSACTION_RESULT_RUNTIME_EXCEPTION = 3,
  TRANSACTION_RESULT_INSUFFICIENT_GAS = 4,
  TRANSACTION_RESULT_INSUFFICIENT_FUNDS = 5,
}

export interface TransactionReceipt {
  'id'?: (_spacemesh_v1_TransactionId | null);
  'result'?: (_spacemesh_v1_TransactionReceipt_TransactionResult | keyof typeof _spacemesh_v1_TransactionReceipt_TransactionResult);
  'gasUsed'?: (number | string | Long);
  'fee'?: (_spacemesh_v1_Amount | null);
  'layer'?: (_spacemesh_v1_LayerNumber | null);
  'index'?: (number);
  'svmData'?: (Buffer | Uint8Array | string);
}

export interface TransactionReceipt__Output {
  'id': (_spacemesh_v1_TransactionId__Output | null);
  'result': (_spacemesh_v1_TransactionReceipt_TransactionResult);
  'gasUsed': (Long);
  'fee': (_spacemesh_v1_Amount__Output | null);
  'layer': (_spacemesh_v1_LayerNumber__Output | null);
  'index': (number);
  'svmData': (Buffer);
}
