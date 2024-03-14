// Original file: vendor/api/spacemesh/v1/smesher_types.proto

import type { Amount as _spacemesh_v1_Amount, Amount__Output as _spacemesh_v1_Amount__Output } from '../../spacemesh/v1/Amount';

export interface EstimatedRewardsResponse {
  'amount'?: (_spacemesh_v1_Amount | null);
  'numUnits'?: (number);
}

export interface EstimatedRewardsResponse__Output {
  'amount': (_spacemesh_v1_Amount__Output | null);
  'numUnits': (number);
}
