// Original file: proto/post_types.proto

import type { MetadataResponse as _spacemesh_v1_MetadataResponse, MetadataResponse__Output as _spacemesh_v1_MetadataResponse__Output } from '../../spacemesh/v1/MetadataResponse';
import type { GenProofResponse as _spacemesh_v1_GenProofResponse, GenProofResponse__Output as _spacemesh_v1_GenProofResponse__Output } from '../../spacemesh/v1/GenProofResponse';

export interface ServiceResponse {
  'metadata'?: (_spacemesh_v1_MetadataResponse | null);
  'genProof'?: (_spacemesh_v1_GenProofResponse | null);
  'kind'?: "metadata"|"genProof";
}

export interface ServiceResponse__Output {
  'metadata'?: (_spacemesh_v1_MetadataResponse__Output | null);
  'genProof'?: (_spacemesh_v1_GenProofResponse__Output | null);
  'kind': "metadata"|"genProof";
}
