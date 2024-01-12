// Original file: proto/admin_types.proto

import type { ConnectionInfo as _spacemesh_v1_ConnectionInfo, ConnectionInfo__Output as _spacemesh_v1_ConnectionInfo__Output } from '../../spacemesh/v1/ConnectionInfo';

export interface PeerInfo {
  'id'?: (string);
  'connections'?: (_spacemesh_v1_ConnectionInfo)[];
  'tags'?: (string)[];
}

export interface PeerInfo__Output {
  'id': (string);
  'connections': (_spacemesh_v1_ConnectionInfo__Output)[];
  'tags': (string)[];
}
