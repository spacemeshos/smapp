// Original file: vendor/api/spacemesh/v1/admin_types.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

// Original file: vendor/api/spacemesh/v1/admin_types.proto

export enum _spacemesh_v1_ConnectionInfo_Kind {
  Uknown = 0,
  Inbound = 1,
  Outbound = 2,
  HPInbound = 3,
  HPOutbound = 4,
  RelayInbound = 5,
  RelayOutbound = 6,
}

export interface ConnectionInfo {
  'address'?: (string);
  'uptime'?: (_google_protobuf_Duration | null);
  'outbound'?: (boolean);
  'kind'?: (_spacemesh_v1_ConnectionInfo_Kind | keyof typeof _spacemesh_v1_ConnectionInfo_Kind);
}

export interface ConnectionInfo__Output {
  'address': (string);
  'uptime': (_google_protobuf_Duration__Output | null);
  'outbound': (boolean);
  'kind': (_spacemesh_v1_ConnectionInfo_Kind);
}
