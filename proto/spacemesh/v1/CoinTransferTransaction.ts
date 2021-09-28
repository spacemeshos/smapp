// Original file: proto/types.proto

import type { AccountId as _spacemesh_v1_AccountId, AccountId__Output as _spacemesh_v1_AccountId__Output } from '../../spacemesh/v1/AccountId';

export interface CoinTransferTransaction {
  'receiver'?: (_spacemesh_v1_AccountId | null);
}

export interface CoinTransferTransaction__Output {
  'receiver': (_spacemesh_v1_AccountId__Output | null);
}
