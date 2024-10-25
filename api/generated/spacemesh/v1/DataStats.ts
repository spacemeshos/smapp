// Original file: vendor/api/spacemesh/v1/debug_types.proto

import type { Long } from '@grpc/proto-loader';

export interface DataStats {
  'bytesSent'?: (number | string | Long);
  'bytesReceived'?: (number | string | Long);
  'sendRate'?: (number | string | Long)[];
  'recvRate'?: (number | string | Long)[];
}

export interface DataStats__Output {
  'bytesSent': (Long);
  'bytesReceived': (Long);
  'sendRate': (Long)[];
  'recvRate': (Long)[];
}
