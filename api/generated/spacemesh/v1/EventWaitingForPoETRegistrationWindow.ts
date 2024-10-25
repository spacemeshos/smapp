// Original file: vendor/api/spacemesh/v1/admin_types.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface EventWaitingForPoETRegistrationWindow {
  'current'?: (number);
  'publish'?: (number);
  'roundEnd'?: (_google_protobuf_Timestamp | null);
  'smesher'?: (Buffer | Uint8Array | string);
}

export interface EventWaitingForPoETRegistrationWindow__Output {
  'current': (number);
  'publish': (number);
  'roundEnd': (_google_protobuf_Timestamp__Output | null);
  'smesher': (Buffer);
}
