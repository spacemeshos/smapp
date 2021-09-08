// Original file: proto/types.proto

import type { Long } from '@grpc/proto-loader';

export interface SimpleInt {
  'value'?: (number | string | Long);
}

export interface SimpleInt__Output {
  'value': (Long);
}
