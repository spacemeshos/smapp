// Original file: proto/types.proto

import type { Long } from '@grpc/proto-loader';

export interface Nonce {
  'counter'?: (number | string | Long);
  'bitfield'?: (number);
}

export interface Nonce__Output {
  'counter': (Long);
  'bitfield': (number);
}
