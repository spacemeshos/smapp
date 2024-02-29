// Original file: vendor/api/spacemesh/v1/global_state_types.proto

import type { AccountData as _spacemesh_v1_AccountData, AccountData__Output as _spacemesh_v1_AccountData__Output } from '../../spacemesh/v1/AccountData';

export interface AccountDataQueryResponse {
  'totalResults'?: (number);
  'accountItem'?: (_spacemesh_v1_AccountData)[];
}

export interface AccountDataQueryResponse__Output {
  'totalResults': (number);
  'accountItem': (_spacemesh_v1_AccountData__Output)[];
}
