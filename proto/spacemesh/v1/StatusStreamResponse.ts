// Original file: proto/node_types.proto

import type { NodeStatus as _spacemesh_v1_NodeStatus, NodeStatus__Output as _spacemesh_v1_NodeStatus__Output } from '../../spacemesh/v1/NodeStatus';

export interface StatusStreamResponse {
  'status'?: (_spacemesh_v1_NodeStatus | null);
}

export interface StatusStreamResponse__Output {
  'status': (_spacemesh_v1_NodeStatus__Output | null);
}
