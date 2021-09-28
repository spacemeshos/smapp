// Original file: proto/global_state_types.proto

import type { AccountDataFilter as _spacemesh_v1_AccountDataFilter, AccountDataFilter__Output as _spacemesh_v1_AccountDataFilter__Output } from '../../spacemesh/v1/AccountDataFilter';

export interface AccountDataQueryRequest {
  'filter'?: (_spacemesh_v1_AccountDataFilter | null);
  'maxResults'?: (number);
  'offset'?: (number);
}

export interface AccountDataQueryRequest__Output {
  'filter': (_spacemesh_v1_AccountDataFilter__Output | null);
  'maxResults': (number);
  'offset': (number);
}
