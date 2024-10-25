// Original file: vendor/api/spacemesh/v1/admin_types.proto

import type { Long } from '@grpc/proto-loader';

export interface EventProofDownloadedFromPoet {
  'url'?: (string);
  'roundId'?: (string);
  'ticks'?: (number | string | Long);
}

export interface EventProofDownloadedFromPoet__Output {
  'url': (string);
  'roundId': (string);
  'ticks': (Long);
}
