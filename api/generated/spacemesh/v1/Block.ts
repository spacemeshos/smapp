// Original file: vendor/api/spacemesh/v1/types.proto

import type { Transaction as _spacemesh_v1_Transaction, Transaction__Output as _spacemesh_v1_Transaction__Output } from '../../spacemesh/v1/Transaction';
import type { ActivationId as _spacemesh_v1_ActivationId, ActivationId__Output as _spacemesh_v1_ActivationId__Output } from '../../spacemesh/v1/ActivationId';
import type { SmesherId as _spacemesh_v1_SmesherId, SmesherId__Output as _spacemesh_v1_SmesherId__Output } from '../../spacemesh/v1/SmesherId';

export interface Block {
  'id'?: (Buffer | Uint8Array | string);
  'transactions'?: (_spacemesh_v1_Transaction)[];
  'activationId'?: (_spacemesh_v1_ActivationId | null);
  'smesherId'?: (_spacemesh_v1_SmesherId | null);
}

export interface Block__Output {
  'id': (Buffer);
  'transactions': (_spacemesh_v1_Transaction__Output)[];
  'activationId': (_spacemesh_v1_ActivationId__Output | null);
  'smesherId': (_spacemesh_v1_SmesherId__Output | null);
}
