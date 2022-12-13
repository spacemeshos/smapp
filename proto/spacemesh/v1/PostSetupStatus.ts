// Original file: proto/smesher_types.proto

import type { PostSetupOpts as _spacemesh_v1_PostSetupOpts, PostSetupOpts__Output as _spacemesh_v1_PostSetupOpts__Output } from '../../spacemesh/v1/PostSetupOpts';
import type { Long } from '@grpc/proto-loader';

// Original file: proto/smesher_types.proto

export enum _spacemesh_v1_PostSetupStatus_State {
  STATE_UNSPECIFIED = 0,
  STATE_NOT_STARTED = 1, // resume . (I stooped I can resume  |> there is no PoS data, u have to wait) or node is not init PoST
  STATE_IN_PROGRESS = 2,
  STATE_STOPPED = 3, //( I started -> stopped or stopped the node, )I pause initing
  STATE_COMPLETE = 4,
  STATE_ERROR = 5, // show report an issue dialog
}

export interface PostSetupStatus {
  'state'?: (_spacemesh_v1_PostSetupStatus_State | keyof typeof _spacemesh_v1_PostSetupStatus_State);
  'numLabelsWritten'?: (number | string | Long);
  'opts'?: (_spacemesh_v1_PostSetupOpts | null);
  'errorMessage'?: (string);
}

export interface PostSetupStatus__Output {
  'state': (_spacemesh_v1_PostSetupStatus_State);
  'numLabelsWritten': (Long);
  'opts': (_spacemesh_v1_PostSetupOpts__Output | null);
  'errorMessage': (string);
}
