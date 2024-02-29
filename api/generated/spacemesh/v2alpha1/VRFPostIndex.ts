// Original file: vendor/api/spacemesh/v2alpha1/activation.proto

import type { Long } from '@grpc/proto-loader';

export interface VRFPostIndex {
  'nonce'?: (number | string | Long);
}

export interface VRFPostIndex__Output {
  'nonce': (Long);
}
