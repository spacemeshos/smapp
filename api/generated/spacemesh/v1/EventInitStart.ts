// Original file: vendor/api/spacemesh/v1/admin_types.proto


export interface EventInitStart {
  'smesher'?: (Buffer | Uint8Array | string);
  'commitment'?: (Buffer | Uint8Array | string);
}

export interface EventInitStart__Output {
  'smesher': (Buffer);
  'commitment': (Buffer);
}
