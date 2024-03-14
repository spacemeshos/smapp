// Original file: vendor/api/spacemesh/v1/node_types.proto

import type { LayerNumber as _spacemesh_v1_LayerNumber, LayerNumber__Output as _spacemesh_v1_LayerNumber__Output } from '../../spacemesh/v1/LayerNumber';
import type { Long } from '@grpc/proto-loader';

export interface NodeStatus {
  'connectedPeers'?: (number | string | Long);
  'isSynced'?: (boolean);
  'syncedLayer'?: (_spacemesh_v1_LayerNumber | null);
  'topLayer'?: (_spacemesh_v1_LayerNumber | null);
  'verifiedLayer'?: (_spacemesh_v1_LayerNumber | null);
}

export interface NodeStatus__Output {
  'connectedPeers': (Long);
  'isSynced': (boolean);
  'syncedLayer': (_spacemesh_v1_LayerNumber__Output | null);
  'topLayer': (_spacemesh_v1_LayerNumber__Output | null);
  'verifiedLayer': (_spacemesh_v1_LayerNumber__Output | null);
}
