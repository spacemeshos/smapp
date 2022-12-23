// Original file: proto/gateway_types.proto


export interface VerifyChallengeRequest {
  'challenge'?: (Buffer | Uint8Array | string);
  'signature'?: (Buffer | Uint8Array | string);
}

export interface VerifyChallengeRequest__Output {
  'challenge': (Buffer);
  'signature': (Buffer);
}
