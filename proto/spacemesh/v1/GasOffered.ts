// Original file: proto/types.proto

import type { Long } from '@grpc/proto-loader';

export interface GasOffered {
  'gasProvided'?: (number | string | Long);
  'gasPrice'?: (number | string | Long);
}

export interface GasOffered__Output {
  'gasProvided': (Long);
  'gasPrice': (Long);
}
