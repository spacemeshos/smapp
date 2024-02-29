// Original file: vendor/api/spacemesh/v1/admin_types.proto


export interface EventPostStart {
  'challenge'?: (Buffer | Uint8Array | string);
  'smesher'?: (Buffer | Uint8Array | string);
}

export interface EventPostStart__Output {
  'challenge': (Buffer);
  'smesher': (Buffer);
}
