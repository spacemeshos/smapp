// Original file: vendor/api/spacemesh/v1/smesher_types.proto

import type { Long } from '@grpc/proto-loader';

// Original file: vendor/api/spacemesh/v1/smesher_types.proto

export enum _spacemesh_v1_PostSetupProvider_DeviceType {
  DEVICE_CLASS_CPU = 0,
  DEVICE_CLASS_GPU = 1,
}

export interface PostSetupProvider {
  'id'?: (number);
  'model'?: (string);
  'deviceType'?: (_spacemesh_v1_PostSetupProvider_DeviceType | keyof typeof _spacemesh_v1_PostSetupProvider_DeviceType);
  'performance'?: (number | string | Long);
}

export interface PostSetupProvider__Output {
  'id': (number);
  'model': (string);
  'deviceType': (_spacemesh_v1_PostSetupProvider_DeviceType);
  'performance': (Long);
}
