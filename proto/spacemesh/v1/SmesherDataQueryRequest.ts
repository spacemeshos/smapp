// Original file: proto/global_state_types.proto

import type { SmesherId as _spacemesh_v1_SmesherId, SmesherId__Output as _spacemesh_v1_SmesherId__Output } from '../../spacemesh/v1/SmesherId';

export interface SmesherDataQueryRequest {
  'smesherId'?: (_spacemesh_v1_SmesherId | null);
  'maxResults'?: (number);
  'offset'?: (number);
}

export interface SmesherDataQueryRequest__Output {
  'smesherId': (_spacemesh_v1_SmesherId__Output | null);
  'maxResults': (number);
  'offset': (number);
}
