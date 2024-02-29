// Original file: vendor/api/spacemesh/v1/types.proto

import type { Long } from '@grpc/proto-loader';

export interface Amount {
  'value'?: (number | string | Long);
}

export interface Amount__Output {
  'value': (Long);
}
