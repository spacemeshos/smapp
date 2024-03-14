// Original file: vendor/api/spacemesh/v2alpha1/reward.proto

import type { Long } from '@grpc/proto-loader';

export interface RewardV1 {
  'layer'?: (number);
  'total'?: (number | string | Long);
  'layerReward'?: (number | string | Long);
  'coinbase'?: (string);
  'smesher'?: (Buffer | Uint8Array | string);
}

export interface RewardV1__Output {
  'layer': (number);
  'total': (Long);
  'layerReward': (Long);
  'coinbase': (string);
  'smesher': (Buffer);
}
