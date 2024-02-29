// Original file: vendor/api/spacemesh/v1/mesh_types.proto

import type { AccountMeshDataFilter as _spacemesh_v1_AccountMeshDataFilter, AccountMeshDataFilter__Output as _spacemesh_v1_AccountMeshDataFilter__Output } from '../../spacemesh/v1/AccountMeshDataFilter';
import type { LayerNumber as _spacemesh_v1_LayerNumber, LayerNumber__Output as _spacemesh_v1_LayerNumber__Output } from '../../spacemesh/v1/LayerNumber';

export interface AccountMeshDataQueryRequest {
  'filter'?: (_spacemesh_v1_AccountMeshDataFilter | null);
  'minLayer'?: (_spacemesh_v1_LayerNumber | null);
  'maxResults'?: (number);
  'offset'?: (number);
}

export interface AccountMeshDataQueryRequest__Output {
  'filter': (_spacemesh_v1_AccountMeshDataFilter__Output | null);
  'minLayer': (_spacemesh_v1_LayerNumber__Output | null);
  'maxResults': (number);
  'offset': (number);
}
