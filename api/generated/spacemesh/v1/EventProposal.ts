// Original file: vendor/api/spacemesh/v1/admin_types.proto


export interface EventProposal {
  'layer'?: (number);
  'proposal'?: (Buffer | Uint8Array | string);
  'smesher'?: (Buffer | Uint8Array | string);
}

export interface EventProposal__Output {
  'layer': (number);
  'proposal': (Buffer);
  'smesher': (Buffer);
}
