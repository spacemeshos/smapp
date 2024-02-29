// Original file: vendor/api/spacemesh/v1/types.proto

import type { SmesherId as _spacemesh_v1_SmesherId, SmesherId__Output as _spacemesh_v1_SmesherId__Output } from '../../spacemesh/v1/SmesherId';
import type { LayerNumber as _spacemesh_v1_LayerNumber, LayerNumber__Output as _spacemesh_v1_LayerNumber__Output } from '../../spacemesh/v1/LayerNumber';

// Original file: vendor/api/spacemesh/v1/types.proto

export enum _spacemesh_v1_MalfeasanceProof_MalfeasanceType {
  MALFEASANCE_UNSPECIFIED = 0,
  MALFEASANCE_ATX = 1,
  MALFEASANCE_BALLOT = 2,
  MALFEASANCE_HARE = 3,
  MALFEASANCE_POST_INDEX = 4,
}

export interface MalfeasanceProof {
  'smesherId'?: (_spacemesh_v1_SmesherId | null);
  'layer'?: (_spacemesh_v1_LayerNumber | null);
  'kind'?: (_spacemesh_v1_MalfeasanceProof_MalfeasanceType | keyof typeof _spacemesh_v1_MalfeasanceProof_MalfeasanceType);
  'debugInfo'?: (string);
  'proof'?: (Buffer | Uint8Array | string);
}

export interface MalfeasanceProof__Output {
  'smesherId': (_spacemesh_v1_SmesherId__Output | null);
  'layer': (_spacemesh_v1_LayerNumber__Output | null);
  'kind': (_spacemesh_v1_MalfeasanceProof_MalfeasanceType);
  'debugInfo': (string);
  'proof': (Buffer);
}
