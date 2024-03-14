// Original file: vendor/api/spacemesh/v1/tx_types.proto


export interface ParseTransactionRequest {
  'transaction'?: (Buffer | Uint8Array | string);
  'verify'?: (boolean);
}

export interface ParseTransactionRequest__Output {
  'transaction': (Buffer);
  'verify': (boolean);
}
