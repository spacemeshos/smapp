// Original file: vendor/api/spacemesh/v1/post_types.proto

import type { Metadata as _spacemesh_v1_Metadata, Metadata__Output as _spacemesh_v1_Metadata__Output } from '../../spacemesh/v1/Metadata';

export interface ProofMetadata {
  'challenge'?: (Buffer | Uint8Array | string);
  'meta'?: (_spacemesh_v1_Metadata | null);
}

export interface ProofMetadata__Output {
  'challenge': (Buffer);
  'meta': (_spacemesh_v1_Metadata__Output | null);
}
