// Original file: vendor/api/spacemesh/v2alpha1/activation.proto

import type { Long } from '@grpc/proto-loader';

export interface PostMeta {
  'challenge'?: (Buffer | Uint8Array | string);
  'labelsPerUnit'?: (number | string | Long);
}

export interface PostMeta__Output {
  'challenge': (Buffer);
  'labelsPerUnit': (Long);
}
