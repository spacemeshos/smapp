// Original file: vendor/api/spacemesh/v1/activation_types.proto

import type { Activation as _spacemesh_v1_Activation, Activation__Output as _spacemesh_v1_Activation__Output } from '../../spacemesh/v1/Activation';
import type { MalfeasanceProof as _spacemesh_v1_MalfeasanceProof, MalfeasanceProof__Output as _spacemesh_v1_MalfeasanceProof__Output } from '../../spacemesh/v1/MalfeasanceProof';

export interface GetResponse {
  'atx'?: (_spacemesh_v1_Activation | null);
  'malfeasanceProof'?: (_spacemesh_v1_MalfeasanceProof | null);
}

export interface GetResponse__Output {
  'atx': (_spacemesh_v1_Activation__Output | null);
  'malfeasanceProof': (_spacemesh_v1_MalfeasanceProof__Output | null);
}
