// Original file: proto/admin_types.proto


export interface EventBeacon {
  'epoch'?: (number);
  'beacon'?: (Buffer | Uint8Array | string);
}

export interface EventBeacon__Output {
  'epoch': (number);
  'beacon': (Buffer);
}
