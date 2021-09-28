// Original file: proto/types.proto


// Original file: proto/types.proto

export enum _spacemesh_v1_Signature_Scheme {
  SCHEME_UNSPECIFIED = 0,
  SCHEME_ED25519 = 1,
  SCHEME_ED25519_PLUS_PLUS = 2,
}

export interface Signature {
  'scheme'?: (_spacemesh_v1_Signature_Scheme | keyof typeof _spacemesh_v1_Signature_Scheme);
  'signature'?: (Buffer | Uint8Array | string);
  'publicKey'?: (Buffer | Uint8Array | string);
}

export interface Signature__Output {
  'scheme': (_spacemesh_v1_Signature_Scheme);
  'signature': (Buffer);
  'publicKey': (Buffer);
}
