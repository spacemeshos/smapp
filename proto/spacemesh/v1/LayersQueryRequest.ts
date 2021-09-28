// Original file: proto/mesh_types.proto

import type { LayerNumber as _spacemesh_v1_LayerNumber, LayerNumber__Output as _spacemesh_v1_LayerNumber__Output } from '../../spacemesh/v1/LayerNumber';

export interface LayersQueryRequest {
  'startLayer'?: (_spacemesh_v1_LayerNumber | null);
  'endLayer'?: (_spacemesh_v1_LayerNumber | null);
}

export interface LayersQueryRequest__Output {
  'startLayer': (_spacemesh_v1_LayerNumber__Output | null);
  'endLayer': (_spacemesh_v1_LayerNumber__Output | null);
}
