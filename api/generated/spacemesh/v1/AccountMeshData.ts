// Original file: vendor/api/spacemesh/v1/mesh_types.proto

import type { MeshTransaction as _spacemesh_v1_MeshTransaction, MeshTransaction__Output as _spacemesh_v1_MeshTransaction__Output } from '../../spacemesh/v1/MeshTransaction';
import type { Activation as _spacemesh_v1_Activation, Activation__Output as _spacemesh_v1_Activation__Output } from '../../spacemesh/v1/Activation';

export interface AccountMeshData {
  'meshTransaction'?: (_spacemesh_v1_MeshTransaction | null);
  'activation'?: (_spacemesh_v1_Activation | null);
  'datum'?: "meshTransaction"|"activation";
}

export interface AccountMeshData__Output {
  'meshTransaction'?: (_spacemesh_v1_MeshTransaction__Output | null);
  'activation'?: (_spacemesh_v1_Activation__Output | null);
  'datum': "meshTransaction"|"activation";
}
