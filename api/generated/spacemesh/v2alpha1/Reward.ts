// Original file: vendor/api/spacemesh/v2alpha1/reward.proto

import type { Long } from '@grpc/proto-loader';

export interface Reward {
  'layer'?: (number);
  'total'?: (number | string | Long);
  'layerReward'?: (number | string | Long);
  'coinbase'?: (string);
  'smesher'?: (Buffer | Uint8Array | string);
}

export interface Reward__Output {
  'layer': (number);
  'total': (Long);
  'layerReward': (Long);
  'coinbase': (string);
  'smesher': (Buffer);
}
