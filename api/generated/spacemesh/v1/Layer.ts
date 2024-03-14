// Original file: vendor/api/spacemesh/v1/types.proto

import type { LayerNumber as _spacemesh_v1_LayerNumber, LayerNumber__Output as _spacemesh_v1_LayerNumber__Output } from '../../spacemesh/v1/LayerNumber';
import type { Block as _spacemesh_v1_Block, Block__Output as _spacemesh_v1_Block__Output } from '../../spacemesh/v1/Block';
import type { Activation as _spacemesh_v1_Activation, Activation__Output as _spacemesh_v1_Activation__Output } from '../../spacemesh/v1/Activation';

// Original file: vendor/api/spacemesh/v1/types.proto

export enum _spacemesh_v1_Layer_LayerStatus {
  LAYER_STATUS_UNSPECIFIED = 0,
  LAYER_STATUS_APPROVED = 1,
  LAYER_STATUS_CONFIRMED = 2,
  LAYER_STATUS_APPLIED = 3,
}

export interface Layer {
  'number'?: (_spacemesh_v1_LayerNumber | null);
  'status'?: (_spacemesh_v1_Layer_LayerStatus | keyof typeof _spacemesh_v1_Layer_LayerStatus);
  'hash'?: (Buffer | Uint8Array | string);
  'blocks'?: (_spacemesh_v1_Block)[];
  'activations'?: (_spacemesh_v1_Activation)[];
  'rootStateHash'?: (Buffer | Uint8Array | string);
}

export interface Layer__Output {
  'number': (_spacemesh_v1_LayerNumber__Output | null);
  'status': (_spacemesh_v1_Layer_LayerStatus);
  'hash': (Buffer);
  'blocks': (_spacemesh_v1_Block__Output)[];
  'activations': (_spacemesh_v1_Activation__Output)[];
  'rootStateHash': (Buffer);
}
