// Original file: proto/smesher_types.proto

import type { Long } from '@grpc/proto-loader';

export interface PostSetupOpts {
  'dataDir'?: (string);
  'numUnits'?: (number);
  'maxFileSize'?: (number | string | Long);
  'computeProviderId'?: (number);
  'throttle'?: (boolean);
}

export interface PostSetupOpts__Output {
  'dataDir': (string);
  'numUnits': (number);
  'maxFileSize': (Long);
  'computeProviderId': (number);
  'throttle': (boolean);
}
