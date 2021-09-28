// Original file: proto/global_state_types.proto

import type { LayerNumber as _spacemesh_v1_LayerNumber, LayerNumber__Output as _spacemesh_v1_LayerNumber__Output } from '../../spacemesh/v1/LayerNumber';

export interface GlobalStateHash {
  'rootHash'?: (Buffer | Uint8Array | string);
  'layer'?: (_spacemesh_v1_LayerNumber | null);
}

export interface GlobalStateHash__Output {
  'rootHash': (Buffer);
  'layer': (_spacemesh_v1_LayerNumber__Output | null);
}
