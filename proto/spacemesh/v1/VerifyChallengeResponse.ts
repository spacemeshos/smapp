// Original file: proto/gateway_types.proto


export interface VerifyChallengeResponse {
  'hash'?: (Buffer | Uint8Array | string);
  'nodeId'?: (Buffer | Uint8Array | string);
}

export interface VerifyChallengeResponse__Output {
  'hash': (Buffer);
  'nodeId': (Buffer);
}
