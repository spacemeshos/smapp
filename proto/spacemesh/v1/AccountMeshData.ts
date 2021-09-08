// Original file: proto/mesh_types.proto

import type { Transaction as _spacemesh_v1_Transaction, Transaction__Output as _spacemesh_v1_Transaction__Output } from '../../spacemesh/v1/Transaction';
import type { Activation as _spacemesh_v1_Activation, Activation__Output as _spacemesh_v1_Activation__Output } from '../../spacemesh/v1/Activation';

export interface AccountMeshData {
  'transaction'?: (_spacemesh_v1_Transaction | null);
  'activation'?: (_spacemesh_v1_Activation | null);
  'datum'?: "transaction"|"activation";
}

export interface AccountMeshData__Output {
  'transaction'?: (_spacemesh_v1_Transaction__Output | null);
  'activation'?: (_spacemesh_v1_Activation__Output | null);
  'datum': "transaction"|"activation";
}
