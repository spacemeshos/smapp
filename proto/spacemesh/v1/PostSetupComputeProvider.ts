// Original file: proto/smesher_types.proto

import type { Long } from '@grpc/proto-loader';

// Original file: proto/smesher_types.proto

export enum _spacemesh_v1_PostSetupComputeProvider_ComputeApiClass {
  COMPUTE_API_CLASS_UNSPECIFIED = 0,
  COMPUTE_API_CLASS_CPU = 1,
  COMPUTE_API_CLASS_CUDA = 2,
  COMPUTE_API_CLASS_VULKAN = 3,
}

export interface PostSetupComputeProvider {
  'id'?: (number);
  'model'?: (string);
  'computeApi'?: (_spacemesh_v1_PostSetupComputeProvider_ComputeApiClass | keyof typeof _spacemesh_v1_PostSetupComputeProvider_ComputeApiClass);
  'performance'?: (number | string | Long);
}

export interface PostSetupComputeProvider__Output {
  'id': (number);
  'model': (string);
  'computeApi': (_spacemesh_v1_PostSetupComputeProvider_ComputeApiClass);
  'performance': (Long);
}
