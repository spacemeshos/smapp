// Original file: vendor/api/spacemesh/v1/admin_types.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface EventPoetWaitRound {
  'current'?: (number);
  'publish'?: (number);
  'wait'?: (_google_protobuf_Duration | null);
  'until'?: (_google_protobuf_Timestamp | null);
  'smesher'?: (Buffer | Uint8Array | string);
}

export interface EventPoetWaitRound__Output {
  'current': (number);
  'publish': (number);
  'wait': (_google_protobuf_Duration__Output | null);
  'until': (_google_protobuf_Timestamp__Output | null);
  'smesher': (Buffer);
}
