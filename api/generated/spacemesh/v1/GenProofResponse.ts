// Original file: vendor/api/spacemesh/v1/post_types.proto

import type { GenProofStatus as _spacemesh_v1_GenProofStatus } from '../../spacemesh/v1/GenProofStatus';
import type { Proof as _spacemesh_v1_Proof, Proof__Output as _spacemesh_v1_Proof__Output } from '../../spacemesh/v1/Proof';
import type { ProofMetadata as _spacemesh_v1_ProofMetadata, ProofMetadata__Output as _spacemesh_v1_ProofMetadata__Output } from '../../spacemesh/v1/ProofMetadata';

export interface GenProofResponse {
  'status'?: (_spacemesh_v1_GenProofStatus | keyof typeof _spacemesh_v1_GenProofStatus);
  'proof'?: (_spacemesh_v1_Proof | null);
  'metadata'?: (_spacemesh_v1_ProofMetadata | null);
}

export interface GenProofResponse__Output {
  'status': (_spacemesh_v1_GenProofStatus);
  'proof': (_spacemesh_v1_Proof__Output | null);
  'metadata': (_spacemesh_v1_ProofMetadata__Output | null);
}
