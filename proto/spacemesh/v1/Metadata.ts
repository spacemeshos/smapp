// Original file: proto/post_types.proto

import type { Long } from '@grpc/proto-loader';

export interface Metadata {
  'nodeId'?: (Buffer | Uint8Array | string);
  'commitmentAtxId'?: (Buffer | Uint8Array | string);
  'nonce'?: (number | string | Long);
  'numUnits'?: (number);
  'labelsPerUnit'?: (number | string | Long);
  '_nonce'?: "nonce";
}

export interface Metadata__Output {
  'nodeId': (Buffer);
  'commitmentAtxId': (Buffer);
  'nonce'?: (Long);
  'numUnits': (number);
  'labelsPerUnit': (Long);
  '_nonce': "nonce";
}
