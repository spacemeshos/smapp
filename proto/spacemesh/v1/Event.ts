// Original file: proto/admin_types.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { EventBeacon as _spacemesh_v1_EventBeacon, EventBeacon__Output as _spacemesh_v1_EventBeacon__Output } from '../../spacemesh/v1/EventBeacon';
import type { EventInitStart as _spacemesh_v1_EventInitStart, EventInitStart__Output as _spacemesh_v1_EventInitStart__Output } from '../../spacemesh/v1/EventInitStart';
import type { EventInitComplete as _spacemesh_v1_EventInitComplete, EventInitComplete__Output as _spacemesh_v1_EventInitComplete__Output } from '../../spacemesh/v1/EventInitComplete';
import type { EventPostStart as _spacemesh_v1_EventPostStart, EventPostStart__Output as _spacemesh_v1_EventPostStart__Output } from '../../spacemesh/v1/EventPostStart';
import type { EventPostComplete as _spacemesh_v1_EventPostComplete, EventPostComplete__Output as _spacemesh_v1_EventPostComplete__Output } from '../../spacemesh/v1/EventPostComplete';
import type { EventPoetWaitRound as _spacemesh_v1_EventPoetWaitRound, EventPoetWaitRound__Output as _spacemesh_v1_EventPoetWaitRound__Output } from '../../spacemesh/v1/EventPoetWaitRound';
import type { EventPoetWaitProof as _spacemesh_v1_EventPoetWaitProof, EventPoetWaitProof__Output as _spacemesh_v1_EventPoetWaitProof__Output } from '../../spacemesh/v1/EventPoetWaitProof';
import type { EventAtxPubished as _spacemesh_v1_EventAtxPubished, EventAtxPubished__Output as _spacemesh_v1_EventAtxPubished__Output } from '../../spacemesh/v1/EventAtxPubished';
import type { EventEligibilities as _spacemesh_v1_EventEligibilities, EventEligibilities__Output as _spacemesh_v1_EventEligibilities__Output } from '../../spacemesh/v1/EventEligibilities';
import type { EventProposal as _spacemesh_v1_EventProposal, EventProposal__Output as _spacemesh_v1_EventProposal__Output } from '../../spacemesh/v1/EventProposal';

export interface Event {
  'timestamp'?: (_google_protobuf_Timestamp | null);
  'failure'?: (boolean);
  'help'?: (string);
  'beacon'?: (_spacemesh_v1_EventBeacon | null);
  'initStart'?: (_spacemesh_v1_EventInitStart | null);
  'initComplete'?: (_spacemesh_v1_EventInitComplete | null);
  'postStart'?: (_spacemesh_v1_EventPostStart | null);
  'postComplete'?: (_spacemesh_v1_EventPostComplete | null);
  'poetWaitRound'?: (_spacemesh_v1_EventPoetWaitRound | null);
  'poetWaitProof'?: (_spacemesh_v1_EventPoetWaitProof | null);
  'atxPublished'?: (_spacemesh_v1_EventAtxPubished | null);
  'eligibilities'?: (_spacemesh_v1_EventEligibilities | null);
  'proposal'?: (_spacemesh_v1_EventProposal | null);
  'details'?: "beacon"|"initStart"|"initComplete"|"postStart"|"postComplete"|"poetWaitRound"|"poetWaitProof"|"atxPublished"|"eligibilities"|"proposal";
}

export interface Event__Output {
  'timestamp': (_google_protobuf_Timestamp__Output | null);
  'failure': (boolean);
  'help': (string);
  'beacon'?: (_spacemesh_v1_EventBeacon__Output | null);
  'initStart'?: (_spacemesh_v1_EventInitStart__Output | null);
  'initComplete'?: (_spacemesh_v1_EventInitComplete__Output | null);
  'postStart'?: (_spacemesh_v1_EventPostStart__Output | null);
  'postComplete'?: (_spacemesh_v1_EventPostComplete__Output | null);
  'poetWaitRound'?: (_spacemesh_v1_EventPoetWaitRound__Output | null);
  'poetWaitProof'?: (_spacemesh_v1_EventPoetWaitProof__Output | null);
  'atxPublished'?: (_spacemesh_v1_EventAtxPubished__Output | null);
  'eligibilities'?: (_spacemesh_v1_EventEligibilities__Output | null);
  'proposal'?: (_spacemesh_v1_EventProposal__Output | null);
  'details': "beacon"|"initStart"|"initComplete"|"postStart"|"postComplete"|"poetWaitRound"|"poetWaitProof"|"atxPublished"|"eligibilities"|"proposal";
}
