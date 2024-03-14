// Original file: vendor/api/spacemesh/v1/admin_types.proto

import type { ProposalEligibility as _spacemesh_v1_ProposalEligibility, ProposalEligibility__Output as _spacemesh_v1_ProposalEligibility__Output } from '../../spacemesh/v1/ProposalEligibility';

export interface EventEligibilities {
  'epoch'?: (number);
  'beacon'?: (Buffer | Uint8Array | string);
  'atx'?: (Buffer | Uint8Array | string);
  'activeSetSize'?: (number);
  'eligibilities'?: (_spacemesh_v1_ProposalEligibility)[];
  'smesher'?: (Buffer | Uint8Array | string);
}

export interface EventEligibilities__Output {
  'epoch': (number);
  'beacon': (Buffer);
  'atx': (Buffer);
  'activeSetSize': (number);
  'eligibilities': (_spacemesh_v1_ProposalEligibility__Output)[];
  'smesher': (Buffer);
}
