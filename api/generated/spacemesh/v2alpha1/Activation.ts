// Original file: vendor/api/spacemesh/v2alpha1/activation.proto

import type { Long } from '@grpc/proto-loader';

export interface Activation {
  'id'?: (Buffer | Uint8Array | string);
  'smesherId'?: (Buffer | Uint8Array | string);
  'publishEpoch'?: (number);
  'coinbase'?: (string);
  'weight'?: (number | string | Long);
  'height'?: (number | string | Long);
  'numUnits'?: (number);
}

export interface Activation__Output {
  'id': (Buffer);
  'smesherId': (Buffer);
  'publishEpoch': (number);
  'coinbase': (string);
  'weight': (Long);
  'height': (Long);
  'numUnits': (number);
}
