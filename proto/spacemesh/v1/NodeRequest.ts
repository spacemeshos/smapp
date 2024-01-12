// Original file: proto/post_types.proto

import type { MetadataRequest as _spacemesh_v1_MetadataRequest, MetadataRequest__Output as _spacemesh_v1_MetadataRequest__Output } from '../../spacemesh/v1/MetadataRequest';
import type { GenProofRequest as _spacemesh_v1_GenProofRequest, GenProofRequest__Output as _spacemesh_v1_GenProofRequest__Output } from '../../spacemesh/v1/GenProofRequest';

export interface NodeRequest {
  'metadata'?: (_spacemesh_v1_MetadataRequest | null);
  'genProof'?: (_spacemesh_v1_GenProofRequest | null);
  'kind'?: "metadata"|"genProof";
}

export interface NodeRequest__Output {
  'metadata'?: (_spacemesh_v1_MetadataRequest__Output | null);
  'genProof'?: (_spacemesh_v1_GenProofRequest__Output | null);
  'kind': "metadata"|"genProof";
}
