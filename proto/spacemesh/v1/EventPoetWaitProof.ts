// Original file: proto/admin_types.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

export interface EventPoetWaitProof {
  'publish'?: (number);
  'target'?: (number);
  'wait'?: (_google_protobuf_Duration | null);
}

export interface EventPoetWaitProof__Output {
  'publish': (number);
  'target': (number);
  'wait': (_google_protobuf_Duration__Output | null);
}
