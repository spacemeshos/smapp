// Original file: vendor/api/spacemesh/v2alpha1/activation.proto

import type { Post as _spacemesh_v2alpha1_Post, Post__Output as _spacemesh_v2alpha1_Post__Output } from '../../spacemesh/v2alpha1/Post';
import type { PoetMembershipProof as _spacemesh_v2alpha1_PoetMembershipProof, PoetMembershipProof__Output as _spacemesh_v2alpha1_PoetMembershipProof__Output } from '../../spacemesh/v2alpha1/PoetMembershipProof';
import type { PostMeta as _spacemesh_v2alpha1_PostMeta, PostMeta__Output as _spacemesh_v2alpha1_PostMeta__Output } from '../../spacemesh/v2alpha1/PostMeta';
import type { VRFPostIndex as _spacemesh_v2alpha1_VRFPostIndex, VRFPostIndex__Output as _spacemesh_v2alpha1_VRFPostIndex__Output } from '../../spacemesh/v2alpha1/VRFPostIndex';
import type { Long } from '@grpc/proto-loader';

export interface ActivationV1 {
  'id'?: (Buffer | Uint8Array | string);
  'nodeId'?: (Buffer | Uint8Array | string);
  'signature'?: (Buffer | Uint8Array | string);
  'publishEpoch'?: (number);
  'sequence'?: (number | string | Long);
  'previousAtx'?: (Buffer | Uint8Array | string);
  'positioningAtx'?: (Buffer | Uint8Array | string);
  'committmentAtx'?: (Buffer | Uint8Array | string);
  'initialPost'?: (_spacemesh_v2alpha1_Post | null);
  'coinbase'?: (string);
  'units'?: (number);
  'baseHeight'?: (number);
  'ticks'?: (number);
  'membership'?: (_spacemesh_v2alpha1_PoetMembershipProof | null);
  'post'?: (_spacemesh_v2alpha1_Post | null);
  'postMeta'?: (_spacemesh_v2alpha1_PostMeta | null);
  'vrfPostIndex'?: (_spacemesh_v2alpha1_VRFPostIndex | null);
}

export interface ActivationV1__Output {
  'id': (Buffer);
  'nodeId': (Buffer);
  'signature': (Buffer);
  'publishEpoch': (number);
  'sequence': (Long);
  'previousAtx': (Buffer);
  'positioningAtx': (Buffer);
  'committmentAtx': (Buffer);
  'initialPost': (_spacemesh_v2alpha1_Post__Output | null);
  'coinbase': (string);
  'units': (number);
  'baseHeight': (number);
  'ticks': (number);
  'membership': (_spacemesh_v2alpha1_PoetMembershipProof__Output | null);
  'post': (_spacemesh_v2alpha1_Post__Output | null);
  'postMeta': (_spacemesh_v2alpha1_PostMeta__Output | null);
  'vrfPostIndex': (_spacemesh_v2alpha1_VRFPostIndex__Output | null);
}
