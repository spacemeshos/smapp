// Original file: vendor/api/spacemesh/v1/admin_types.proto

import type { Long } from '@grpc/proto-loader';

export interface EventBestProofSelected {
  'url'?: (string);
  'roundId'?: (string);
  'ticks'?: (number | string | Long);
  'smesher'?: (Buffer | Uint8Array | string);
}

export interface EventBestProofSelected__Output {
  'url': (string);
  'roundId': (string);
  'ticks': (Long);
  'smesher': (Buffer);
}
