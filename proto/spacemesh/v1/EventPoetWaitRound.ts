// Original file: proto/admin_types.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

export interface EventPoetWaitRound {
  'current'?: (number);
  'publish'?: (number);
  'wait'?: (_google_protobuf_Duration | null);
}

export interface EventPoetWaitRound__Output {
  'current': (number);
  'publish': (number);
  'wait': (_google_protobuf_Duration__Output | null);
}
