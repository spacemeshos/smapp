// Original file: proto/admin_types.proto


export interface EventInitFailed {
  'smesher'?: (Buffer | Uint8Array | string);
  'commitment'?: (Buffer | Uint8Array | string);
  'error'?: (string);
}

export interface EventInitFailed__Output {
  'smesher': (Buffer);
  'commitment': (Buffer);
  'error': (string);
}
