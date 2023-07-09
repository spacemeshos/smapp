// Original file: proto/admin_types.proto


export interface CheckpointStreamRequest {
  'snapshotLayer'?: (number);
  'numAtxs'?: (number);
}

export interface CheckpointStreamRequest__Output {
  'snapshotLayer': (number);
  'numAtxs': (number);
}
