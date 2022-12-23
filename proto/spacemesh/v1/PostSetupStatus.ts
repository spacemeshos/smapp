// Original file: proto/smesher_types.proto

import type { PostSetupOpts as _spacemesh_v1_PostSetupOpts, PostSetupOpts__Output as _spacemesh_v1_PostSetupOpts__Output } from '../../spacemesh/v1/PostSetupOpts';
import type { Long } from '@grpc/proto-loader';

// Original file: proto/smesher_types.proto

export enum _spacemesh_v1_PostSetupStatus_State {
  STATE_UNSPECIFIED = 0,
  STATE_NOT_STARTED = 1,
  STATE_IN_PROGRESS = 2,
  STATE_PAUSED = 3,
  STATE_COMPLETE = 4,
  STATE_ERROR = 5,
}

export interface PostSetupStatus {
  'state'?: (_spacemesh_v1_PostSetupStatus_State | keyof typeof _spacemesh_v1_PostSetupStatus_State);
  'numLabelsWritten'?: (number | string | Long);
  'opts'?: (_spacemesh_v1_PostSetupOpts | null);
}

export interface PostSetupStatus__Output {
  'state': (_spacemesh_v1_PostSetupStatus_State);
  'numLabelsWritten': (Long);
  'opts': (_spacemesh_v1_PostSetupOpts__Output | null);
}
