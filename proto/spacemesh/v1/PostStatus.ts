// Original file: proto/smesher_types.proto

import type { PostInitOpts as _spacemesh_v1_PostInitOpts, PostInitOpts__Output as _spacemesh_v1_PostInitOpts__Output } from '../../spacemesh/v1/PostInitOpts';
import type { Long } from '@grpc/proto-loader';

// Original file: proto/smesher_types.proto

export enum _spacemesh_v1_PostStatus_InitStatus {
  INIT_STATUS_UNSPECIFIED = 0,
  INIT_STATUS_NOT_STARTED = 1,
  INIT_STATUS_IN_PROGRESS = 2,
  INIT_STATUS_COMPLETE = 3,
  INIT_STATUS_ERROR = 4,
}

export interface PostStatus {
  'initStatus'?: (_spacemesh_v1_PostStatus_InitStatus | keyof typeof _spacemesh_v1_PostStatus_InitStatus);
  'initOpts'?: (_spacemesh_v1_PostInitOpts | null);
  'numLabelsWritten'?: (number | string | Long);
  'errorMessage'?: (string);
}

export interface PostStatus__Output {
  'initStatus': (_spacemesh_v1_PostStatus_InitStatus);
  'initOpts': (_spacemesh_v1_PostInitOpts__Output | null);
  'numLabelsWritten': (Long);
  'errorMessage': (string);
}
