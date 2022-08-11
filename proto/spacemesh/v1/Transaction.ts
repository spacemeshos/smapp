// Original file: proto/types.proto

import type { AccountId as _spacemesh_v1_AccountId, AccountId__Output as _spacemesh_v1_AccountId__Output } from '../../spacemesh/v1/AccountId';
import type { Nonce as _spacemesh_v1_Nonce, Nonce__Output as _spacemesh_v1_Nonce__Output } from '../../spacemesh/v1/Nonce';
import type { LayerLimits as _spacemesh_v1_LayerLimits, LayerLimits__Output as _spacemesh_v1_LayerLimits__Output } from '../../spacemesh/v1/LayerLimits';
import type { Long } from '@grpc/proto-loader';

export interface Transaction {
  'id'?: (Buffer | Uint8Array | string);
  'principal'?: (_spacemesh_v1_AccountId | null);
  'template'?: (_spacemesh_v1_AccountId | null);
  'method'?: (number);
  'nonce'?: (_spacemesh_v1_Nonce | null);
  'limits'?: (_spacemesh_v1_LayerLimits | null);
  'maxGas'?: (number | string | Long);
  'gasPrice'?: (number | string | Long);
  'maxSpend'?: (number | string | Long);
  'raw'?: (Buffer | Uint8Array | string);
}

export interface Transaction__Output {
  'id': (Buffer);
  'principal': (_spacemesh_v1_AccountId__Output | null);
  'template': (_spacemesh_v1_AccountId__Output | null);
  'method': (number);
  'nonce': (_spacemesh_v1_Nonce__Output | null);
  'limits': (_spacemesh_v1_LayerLimits__Output | null);
  'maxGas': (Long);
  'gasPrice': (Long);
  'maxSpend': (Long);
  'raw': (Buffer);
}
