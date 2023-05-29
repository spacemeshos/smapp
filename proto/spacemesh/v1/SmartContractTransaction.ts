// Original file: proto/types.proto

import type { AccountId as _spacemesh_v1_AccountId, AccountId__Output as _spacemesh_v1_AccountId__Output } from '../../spacemesh/v1/AccountId';

// Original file: proto/types.proto

export enum _spacemesh_v1_SmartContractTransaction_TransactionType {
  TRANSACTION_TYPE_UNSPECIFIED = 0,
  TRANSACTION_TYPE_APP = 1,
  TRANSACTION_TYPE_APP_SPAWN_APP = 2,
  TRANSACTION_TYPE_DEPLOY_TEMPLATE = 3,
}

export interface SmartContractTransaction {
  'type'?: (_spacemesh_v1_SmartContractTransaction_TransactionType | keyof typeof _spacemesh_v1_SmartContractTransaction_TransactionType);
  'data'?: (Buffer | Uint8Array | string);
  'accountId'?: (_spacemesh_v1_AccountId | null);
}

export interface SmartContractTransaction__Output {
  'type': (_spacemesh_v1_SmartContractTransaction_TransactionType);
  'data': (Buffer);
  'accountId': (_spacemesh_v1_AccountId__Output | null);
}
