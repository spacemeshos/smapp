// Original file: vendor/api/spacemesh/v2alpha1/activation.proto

import type { Long } from '@grpc/proto-loader';

export interface ActivationRequest {
  'startEpoch'?: (number);
  'endEpoch'?: (number);
  'id'?: (Buffer | Uint8Array | string)[];
  'smesherId'?: (Buffer | Uint8Array | string)[];
  'coinbase'?: (string);
  'offset'?: (number | string | Long);
  'limit'?: (number | string | Long);
}

export interface ActivationRequest__Output {
  'startEpoch': (number);
  'endEpoch': (number);
  'id': (Buffer)[];
  'smesherId': (Buffer)[];
  'coinbase': (string);
  'offset': (Long);
  'limit': (Long);
}
