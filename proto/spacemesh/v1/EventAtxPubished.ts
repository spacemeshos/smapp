// Original file: proto/admin_types.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

export interface EventAtxPubished {
  'current'?: (number);
  'target'?: (number);
  'id'?: (Buffer | Uint8Array | string);
  'wait'?: (_google_protobuf_Duration | null);
}

export interface EventAtxPubished__Output {
  'current': (number);
  'target': (number);
  'id': (Buffer);
  'wait': (_google_protobuf_Duration__Output | null);
}
