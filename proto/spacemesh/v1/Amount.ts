// Original file: proto/types.proto

import type { Long } from '@grpc/proto-loader';

export interface Amount {
  'value'?: (number | string | Long);
}

export interface Amount__Output {
  'value': (Long);
}
