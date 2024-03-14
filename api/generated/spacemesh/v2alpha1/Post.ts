// Original file: vendor/api/spacemesh/v2alpha1/activation.proto

import type { Long } from '@grpc/proto-loader';

export interface Post {
  'nonce'?: (number);
  'indices'?: (Buffer | Uint8Array | string);
  'pow'?: (number | string | Long);
}

export interface Post__Output {
  'nonce': (number);
  'indices': (Buffer);
  'pow': (Long);
}
