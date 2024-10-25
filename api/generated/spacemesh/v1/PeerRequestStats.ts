// Original file: vendor/api/spacemesh/v1/admin_types.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';
import type { Long } from '@grpc/proto-loader';

export interface PeerRequestStats {
  'successCount'?: (number | string | Long);
  'failureCount'?: (number | string | Long);
  'latency'?: (_google_protobuf_Duration | null);
  '_latency'?: "latency";
}

export interface PeerRequestStats__Output {
  'successCount': (Long);
  'failureCount': (Long);
  'latency'?: (_google_protobuf_Duration__Output | null);
  '_latency': "latency";
}
