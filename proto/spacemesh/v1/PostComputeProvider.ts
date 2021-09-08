// Original file: proto/smesher_types.proto

import type { ComputeApiClass as _spacemesh_v1_ComputeApiClass } from '../../spacemesh/v1/ComputeApiClass';
import type { Long } from '@grpc/proto-loader';

export interface PostComputeProvider {
  'id'?: (number);
  'model'?: (string);
  'computeApi'?: (_spacemesh_v1_ComputeApiClass | keyof typeof _spacemesh_v1_ComputeApiClass);
  'performance'?: (number | string | Long);
}

export interface PostComputeProvider__Output {
  'id': (number);
  'model': (string);
  'computeApi': (_spacemesh_v1_ComputeApiClass);
  'performance': (Long);
}
