// Original file: vendor/api/spacemesh/v1/admin_types.proto

import type { ConnectionInfo as _spacemesh_v1_ConnectionInfo, ConnectionInfo__Output as _spacemesh_v1_ConnectionInfo__Output } from '../../spacemesh/v1/ConnectionInfo';
import type { PeerRequestStats as _spacemesh_v1_PeerRequestStats, PeerRequestStats__Output as _spacemesh_v1_PeerRequestStats__Output } from '../../spacemesh/v1/PeerRequestStats';
import type { Long } from '@grpc/proto-loader';

export interface PeerInfo {
  'id'?: (string);
  'connections'?: (_spacemesh_v1_ConnectionInfo)[];
  'tags'?: (string)[];
  'clientStats'?: (_spacemesh_v1_PeerRequestStats | null);
  'serverStats'?: (_spacemesh_v1_PeerRequestStats | null);
  'bytesSent'?: (number | string | Long);
  'bytesReceived'?: (number | string | Long);
  'sendRate'?: (number | string | Long)[];
  'recvRate'?: (number | string | Long)[];
  '_clientStats'?: "clientStats";
  '_serverStats'?: "serverStats";
}

export interface PeerInfo__Output {
  'id': (string);
  'connections': (_spacemesh_v1_ConnectionInfo__Output)[];
  'tags': (string)[];
  'clientStats'?: (_spacemesh_v1_PeerRequestStats__Output | null);
  'serverStats'?: (_spacemesh_v1_PeerRequestStats__Output | null);
  'bytesSent': (Long);
  'bytesReceived': (Long);
  'sendRate': (Long)[];
  'recvRate': (Long)[];
  '_clientStats': "clientStats";
  '_serverStats': "serverStats";
}
