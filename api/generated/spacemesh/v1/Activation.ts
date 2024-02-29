// Original file: vendor/api/spacemesh/v1/types.proto

import type { ActivationId as _spacemesh_v1_ActivationId, ActivationId__Output as _spacemesh_v1_ActivationId__Output } from '../../spacemesh/v1/ActivationId';
import type { LayerNumber as _spacemesh_v1_LayerNumber, LayerNumber__Output as _spacemesh_v1_LayerNumber__Output } from '../../spacemesh/v1/LayerNumber';
import type { SmesherId as _spacemesh_v1_SmesherId, SmesherId__Output as _spacemesh_v1_SmesherId__Output } from '../../spacemesh/v1/SmesherId';
import type { AccountId as _spacemesh_v1_AccountId, AccountId__Output as _spacemesh_v1_AccountId__Output } from '../../spacemesh/v1/AccountId';
import type { Long } from '@grpc/proto-loader';

export interface Activation {
  'id'?: (_spacemesh_v1_ActivationId | null);
  'layer'?: (_spacemesh_v1_LayerNumber | null);
  'smesherId'?: (_spacemesh_v1_SmesherId | null);
  'coinbase'?: (_spacemesh_v1_AccountId | null);
  'prevAtx'?: (_spacemesh_v1_ActivationId | null);
  'numUnits'?: (number);
  'sequence'?: (number | string | Long);
}

export interface Activation__Output {
  'id': (_spacemesh_v1_ActivationId__Output | null);
  'layer': (_spacemesh_v1_LayerNumber__Output | null);
  'smesherId': (_spacemesh_v1_SmesherId__Output | null);
  'coinbase': (_spacemesh_v1_AccountId__Output | null);
  'prevAtx': (_spacemesh_v1_ActivationId__Output | null);
  'numUnits': (number);
  'sequence': (Long);
}
