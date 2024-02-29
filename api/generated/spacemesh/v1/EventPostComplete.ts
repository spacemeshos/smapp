// Original file: vendor/api/spacemesh/v1/admin_types.proto


export interface EventPostComplete {
  'challenge'?: (Buffer | Uint8Array | string);
  'smesher'?: (Buffer | Uint8Array | string);
}

export interface EventPostComplete__Output {
  'challenge': (Buffer);
  'smesher': (Buffer);
}
