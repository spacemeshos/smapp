// Original file: vendor/api/spacemesh/v1/types.proto

import type { Transaction as _spacemesh_v1_Transaction, Transaction__Output as _spacemesh_v1_Transaction__Output } from '../../spacemesh/v1/Transaction';
import type { LayerNumber as _spacemesh_v1_LayerNumber, LayerNumber__Output as _spacemesh_v1_LayerNumber__Output } from '../../spacemesh/v1/LayerNumber';

export interface MeshTransaction {
  'transaction'?: (_spacemesh_v1_Transaction | null);
  'layerId'?: (_spacemesh_v1_LayerNumber | null);
}

export interface MeshTransaction__Output {
  'transaction': (_spacemesh_v1_Transaction__Output | null);
  'layerId': (_spacemesh_v1_LayerNumber__Output | null);
}
