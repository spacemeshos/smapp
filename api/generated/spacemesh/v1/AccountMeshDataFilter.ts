// Original file: vendor/api/spacemesh/v1/mesh_types.proto

import type { AccountId as _spacemesh_v1_AccountId, AccountId__Output as _spacemesh_v1_AccountId__Output } from '../../spacemesh/v1/AccountId';

export interface AccountMeshDataFilter {
  'accountId'?: (_spacemesh_v1_AccountId | null);
  'accountMeshDataFlags'?: (number);
}

export interface AccountMeshDataFilter__Output {
  'accountId': (_spacemesh_v1_AccountId__Output | null);
  'accountMeshDataFlags': (number);
}
