// Original file: vendor/api/spacemesh/v2alpha1/reward.proto


export interface RewardStreamRequest {
  'startLayer'?: (number);
  'endLayer'?: (number);
  'coinbase'?: (string);
  'smesher'?: (Buffer | Uint8Array | string);
  'watch'?: (boolean);
  'filterBy'?: "coinbase"|"smesher";
}

export interface RewardStreamRequest__Output {
  'startLayer': (number);
  'endLayer': (number);
  'coinbase'?: (string);
  'smesher'?: (Buffer);
  'watch': (boolean);
  'filterBy': "coinbase"|"smesher";
}
