// Original file: vendor/api/spacemesh/v2alpha1/activation.proto


export interface ActivationStreamRequest {
  'startEpoch'?: (number);
  'endEpoch'?: (number);
  'id'?: (Buffer | Uint8Array | string);
  'nodeId'?: (Buffer | Uint8Array | string);
  'coinbase'?: (string);
  'watch'?: (boolean);
}

export interface ActivationStreamRequest__Output {
  'startEpoch': (number);
  'endEpoch': (number);
  'id': (Buffer);
  'nodeId': (Buffer);
  'coinbase': (string);
  'watch': (boolean);
}
