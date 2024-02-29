// Original file: vendor/api/spacemesh/v2alpha1/reward.proto

import type { Long } from '@grpc/proto-loader';

export interface RewardRequest {
  'startLayer'?: (number);
  'endLayer'?: (number);
  'coinbase'?: (string);
  'smesher'?: (Buffer | Uint8Array | string);
  'offset'?: (number | string | Long);
  'limit'?: (number | string | Long);
  'filterBy'?: "coinbase"|"smesher";
}

export interface RewardRequest__Output {
  'startLayer': (number);
  'endLayer': (number);
  'coinbase'?: (string);
  'smesher'?: (Buffer);
  'offset': (Long);
  'limit': (Long);
  'filterBy': "coinbase"|"smesher";
}
