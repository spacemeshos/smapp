// Original file: vendor/api/spacemesh/v1/global_state_types.proto

import type { Amount as _spacemesh_v1_Amount, Amount__Output as _spacemesh_v1_Amount__Output } from '../../spacemesh/v1/Amount';
import type { Long } from '@grpc/proto-loader';

export interface AccountState {
  'counter'?: (number | string | Long);
  'balance'?: (_spacemesh_v1_Amount | null);
}

export interface AccountState__Output {
  'counter': (Long);
  'balance': (_spacemesh_v1_Amount__Output | null);
}
