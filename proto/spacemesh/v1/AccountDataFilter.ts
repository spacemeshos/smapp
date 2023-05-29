// Original file: proto/global_state_types.proto

import type { AccountId as _spacemesh_v1_AccountId, AccountId__Output as _spacemesh_v1_AccountId__Output } from '../../spacemesh/v1/AccountId';

export interface AccountDataFilter {
  'accountId'?: (_spacemesh_v1_AccountId | null);
  'accountDataFlags'?: (number);
}

export interface AccountDataFilter__Output {
  'accountId': (_spacemesh_v1_AccountId__Output | null);
  'accountDataFlags': (number);
}
