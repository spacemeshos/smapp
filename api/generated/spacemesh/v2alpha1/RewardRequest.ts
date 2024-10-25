// Original file: vendor/api/spacemesh/v2alpha1/reward.proto

import type { SortOrder as _spacemesh_v2alpha1_SortOrder } from '../../spacemesh/v2alpha1/SortOrder';
import type { Long } from '@grpc/proto-loader';

export interface RewardRequest {
  'startLayer'?: (number);
  'endLayer'?: (number);
  'coinbase'?: (string);
  'smesher'?: (Buffer | Uint8Array | string);
  'offset'?: (number | string | Long);
  'limit'?: (number | string | Long);
  'sortOrder'?: (_spacemesh_v2alpha1_SortOrder | keyof typeof _spacemesh_v2alpha1_SortOrder);
  'filterBy'?: "coinbase"|"smesher";
}

export interface RewardRequest__Output {
  'startLayer': (number);
  'endLayer': (number);
  'coinbase'?: (string);
  'smesher'?: (Buffer);
  'offset': (Long);
  'limit': (Long);
  'sortOrder': (_spacemesh_v2alpha1_SortOrder);
  'filterBy': "coinbase"|"smesher";
}
