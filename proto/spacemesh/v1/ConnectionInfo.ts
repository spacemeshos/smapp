// Original file: proto/admin_types.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

export interface ConnectionInfo {
  'address'?: (string);
  'uptime'?: (_google_protobuf_Duration | null);
  'outbound'?: (boolean);
}

export interface ConnectionInfo__Output {
  'address': (string);
  'uptime': (_google_protobuf_Duration__Output | null);
  'outbound': (boolean);
}
