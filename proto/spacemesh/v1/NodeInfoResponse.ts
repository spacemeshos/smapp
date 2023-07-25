// Original file: proto/node_types.proto


export interface NodeInfoResponse {
  'hrp'?: (string);
  'firstGenesis'?: (number);
  'effectiveGenesis'?: (number);
  'epochSize'?: (number);
}

export interface NodeInfoResponse__Output {
  'hrp': (string);
  'firstGenesis': (number);
  'effectiveGenesis': (number);
  'epochSize': (number);
}
