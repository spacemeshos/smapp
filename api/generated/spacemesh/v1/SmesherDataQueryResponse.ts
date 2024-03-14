// Original file: vendor/api/spacemesh/v1/global_state_types.proto

import type { Reward as _spacemesh_v1_Reward, Reward__Output as _spacemesh_v1_Reward__Output } from '../../spacemesh/v1/Reward';

export interface SmesherDataQueryResponse {
  'totalResults'?: (number);
  'rewards'?: (_spacemesh_v1_Reward)[];
}

export interface SmesherDataQueryResponse__Output {
  'totalResults': (number);
  'rewards': (_spacemesh_v1_Reward__Output)[];
}
