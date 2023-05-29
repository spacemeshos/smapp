// Original file: proto/global_state_types.proto

import type { AccountId as _spacemesh_v1_AccountId, AccountId__Output as _spacemesh_v1_AccountId__Output } from '../../spacemesh/v1/AccountId';
import type { AccountState as _spacemesh_v1_AccountState, AccountState__Output as _spacemesh_v1_AccountState__Output } from '../../spacemesh/v1/AccountState';

export interface Account {
  'accountId'?: (_spacemesh_v1_AccountId | null);
  'stateCurrent'?: (_spacemesh_v1_AccountState | null);
  'stateProjected'?: (_spacemesh_v1_AccountState | null);
}

export interface Account__Output {
  'accountId': (_spacemesh_v1_AccountId__Output | null);
  'stateCurrent': (_spacemesh_v1_AccountState__Output | null);
  'stateProjected': (_spacemesh_v1_AccountState__Output | null);
}
