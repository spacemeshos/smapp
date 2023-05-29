// Original file: proto/tx_types.proto


export interface TransactionResultsRequest {
  'id'?: (Buffer | Uint8Array | string);
  'address'?: (string);
  'start'?: (number);
  'end'?: (number);
  'watch'?: (boolean);
}

export interface TransactionResultsRequest__Output {
  'id': (Buffer);
  'address': (string);
  'start': (number);
  'end': (number);
  'watch': (boolean);
}
