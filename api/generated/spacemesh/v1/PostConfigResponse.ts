// Original file: vendor/api/spacemesh/v1/smesher_types.proto

import type { Long } from '@grpc/proto-loader';

export interface PostConfigResponse {
  'bitsPerLabel'?: (number);
  'labelsPerUnit'?: (number | string | Long);
  'minNumUnits'?: (number);
  'maxNumUnits'?: (number);
  'k1'?: (number);
  'k2'?: (number);
}

export interface PostConfigResponse__Output {
  'bitsPerLabel': (number);
  'labelsPerUnit': (Long);
  'minNumUnits': (number);
  'maxNumUnits': (number);
  'k1': (number);
  'k2': (number);
}
