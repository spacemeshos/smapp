// Original file: proto/smesher_types.proto

import type { AccountId as _spacemesh_v1_AccountId, AccountId__Output as _spacemesh_v1_AccountId__Output } from '../../spacemesh/v1/AccountId';
import type { PostSetupOpts as _spacemesh_v1_PostSetupOpts, PostSetupOpts__Output as _spacemesh_v1_PostSetupOpts__Output } from '../../spacemesh/v1/PostSetupOpts';

export interface StartSmeshingRequest {
  'coinbase'?: (_spacemesh_v1_AccountId | null);
  'opts'?: (_spacemesh_v1_PostSetupOpts | null);
}

export interface StartSmeshingRequest__Output {
  'coinbase': (_spacemesh_v1_AccountId__Output | null);
  'opts': (_spacemesh_v1_PostSetupOpts__Output | null);
}
