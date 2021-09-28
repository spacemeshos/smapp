// Original file: proto/tx_types.proto


export interface SubmitTransactionRequest {
  'transaction'?: (Buffer | Uint8Array | string);
}

export interface SubmitTransactionRequest__Output {
  'transaction': (Buffer);
}
