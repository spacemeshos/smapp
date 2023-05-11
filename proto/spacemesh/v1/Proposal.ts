// Original file: proto/debug_types.proto

import type { EpochNumber as _spacemesh_v1_EpochNumber, EpochNumber__Output as _spacemesh_v1_EpochNumber__Output } from '../../spacemesh/v1/EpochNumber';
import type { LayerNumber as _spacemesh_v1_LayerNumber, LayerNumber__Output as _spacemesh_v1_LayerNumber__Output } from '../../spacemesh/v1/LayerNumber';
import type { SmesherId as _spacemesh_v1_SmesherId, SmesherId__Output as _spacemesh_v1_SmesherId__Output } from '../../spacemesh/v1/SmesherId';
import type { EpochData as _spacemesh_v1_EpochData, EpochData__Output as _spacemesh_v1_EpochData__Output } from '../../spacemesh/v1/EpochData';
import type { Eligibility as _spacemesh_v1_Eligibility, Eligibility__Output as _spacemesh_v1_Eligibility__Output } from '../../spacemesh/v1/Eligibility';

// Original file: proto/debug_types.proto

export enum _spacemesh_v1_Proposal_Status {
  Created = 0,
  Included = 1,
}

export interface Proposal {
  'id'?: (Buffer | Uint8Array | string);
  'epoch'?: (_spacemesh_v1_EpochNumber | null);
  'layer'?: (_spacemesh_v1_LayerNumber | null);
  'smesher'?: (_spacemesh_v1_SmesherId | null);
  'reference'?: (Buffer | Uint8Array | string);
  'data'?: (_spacemesh_v1_EpochData | null);
  'ballot'?: (Buffer | Uint8Array | string);
  'eligibilities'?: (_spacemesh_v1_Eligibility)[];
  'status'?: (_spacemesh_v1_Proposal_Status | keyof typeof _spacemesh_v1_Proposal_Status);
  'epochData'?: "reference"|"data";
}

export interface Proposal__Output {
  'id': (Buffer);
  'epoch': (_spacemesh_v1_EpochNumber__Output | null);
  'layer': (_spacemesh_v1_LayerNumber__Output | null);
  'smesher': (_spacemesh_v1_SmesherId__Output | null);
  'reference'?: (Buffer);
  'data'?: (_spacemesh_v1_EpochData__Output | null);
  'ballot': (Buffer);
  'eligibilities': (_spacemesh_v1_Eligibility__Output)[];
  'status': (_spacemesh_v1_Proposal_Status);
  'epochData': "reference"|"data";
}
