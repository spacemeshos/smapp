// Original file: vendor/api/spacemesh/v1/types.proto

import type { LayerNumber as _spacemesh_v1_LayerNumber, LayerNumber__Output as _spacemesh_v1_LayerNumber__Output } from '../../spacemesh/v1/LayerNumber';
import type { Amount as _spacemesh_v1_Amount, Amount__Output as _spacemesh_v1_Amount__Output } from '../../spacemesh/v1/Amount';
import type { AccountId as _spacemesh_v1_AccountId, AccountId__Output as _spacemesh_v1_AccountId__Output } from '../../spacemesh/v1/AccountId';
import type { SmesherId as _spacemesh_v1_SmesherId, SmesherId__Output as _spacemesh_v1_SmesherId__Output } from '../../spacemesh/v1/SmesherId';

export interface Reward {
  'layer'?: (_spacemesh_v1_LayerNumber | null);
  'total'?: (_spacemesh_v1_Amount | null);
  'layerReward'?: (_spacemesh_v1_Amount | null);
  'layerComputed'?: (_spacemesh_v1_LayerNumber | null);
  'coinbase'?: (_spacemesh_v1_AccountId | null);
  'smesher'?: (_spacemesh_v1_SmesherId | null);
}

export interface Reward__Output {
  'layer': (_spacemesh_v1_LayerNumber__Output | null);
  'total': (_spacemesh_v1_Amount__Output | null);
  'layerReward': (_spacemesh_v1_Amount__Output | null);
  'layerComputed': (_spacemesh_v1_LayerNumber__Output | null);
  'coinbase': (_spacemesh_v1_AccountId__Output | null);
  'smesher': (_spacemesh_v1_SmesherId__Output | null);
}
