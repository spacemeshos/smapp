// Original file: vendor/api/spacemesh/v1/post_types.proto

import type { Long } from '@grpc/proto-loader';

export interface Proof {
  'nonce'?: (number);
  'indices'?: (Buffer | Uint8Array | string);
  'pow'?: (number | string | Long);
}

export interface Proof__Output {
  'nonce': (number);
  'indices': (Buffer);
  'pow': (Long);
}
