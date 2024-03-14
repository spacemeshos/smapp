// Original file: vendor/api/spacemesh/v2alpha1/activation.proto

import type { Long } from '@grpc/proto-loader';

export interface PoetMembershipProof {
  'proofNodes'?: (Buffer | Uint8Array | string)[];
  'leaf'?: (number | string | Long);
}

export interface PoetMembershipProof__Output {
  'proofNodes': (Buffer)[];
  'leaf': (Long);
}
