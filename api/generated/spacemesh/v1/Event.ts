// Original file: vendor/api/spacemesh/v1/admin_types.proto

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
import type { EventInitFailed as _spacemesh_v1_EventInitFailed, EventInitFailed__Output as _spacemesh_v1_EventInitFailed__Output } from '../../spacemesh/v1/EventInitFailed';
import type { EventMalfeasance as _spacemesh_v1_EventMalfeasance, EventMalfeasance__Output as _spacemesh_v1_EventMalfeasance__Output } from '../../spacemesh/v1/EventMalfeasance';
import type { EventPostServiceStarted as _spacemesh_v1_EventPostServiceStarted, EventPostServiceStarted__Output as _spacemesh_v1_EventPostServiceStarted__Output } from '../../spacemesh/v1/EventPostServiceStarted';
import type { EventPostServiceStopped as _spacemesh_v1_EventPostServiceStopped, EventPostServiceStopped__Output as _spacemesh_v1_EventPostServiceStopped__Output } from '../../spacemesh/v1/EventPostServiceStopped';
import type { EventWaitingForPoETRegistrationWindow as _spacemesh_v1_EventWaitingForPoETRegistrationWindow, EventWaitingForPoETRegistrationWindow__Output as _spacemesh_v1_EventWaitingForPoETRegistrationWindow__Output } from '../../spacemesh/v1/EventWaitingForPoETRegistrationWindow';
import type { EventProofDownloadedFromPoet as _spacemesh_v1_EventProofDownloadedFromPoet, EventProofDownloadedFromPoet__Output as _spacemesh_v1_EventProofDownloadedFromPoet__Output } from '../../spacemesh/v1/EventProofDownloadedFromPoet';
import type { EventRegisteredInPoet as _spacemesh_v1_EventRegisteredInPoet, EventRegisteredInPoet__Output as _spacemesh_v1_EventRegisteredInPoet__Output } from '../../spacemesh/v1/EventRegisteredInPoet';
import type { EventBestProofSelected as _spacemesh_v1_EventBestProofSelected, EventBestProofSelected__Output as _spacemesh_v1_EventBestProofSelected__Output } from '../../spacemesh/v1/EventBestProofSelected';
import type { EventWaitingForPoETRoundEnd as _spacemesh_v1_EventWaitingForPoETRoundEnd, EventWaitingForPoETRoundEnd__Output as _spacemesh_v1_EventWaitingForPoETRoundEnd__Output } from '../../spacemesh/v1/EventWaitingForPoETRoundEnd';

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
  'initFailed'?: (_spacemesh_v1_EventInitFailed | null);
  'malfeasance'?: (_spacemesh_v1_EventMalfeasance | null);
  'postServiceStarted'?: (_spacemesh_v1_EventPostServiceStarted | null);
  'postServiceStopped'?: (_spacemesh_v1_EventPostServiceStopped | null);
  'waitingForPoetRegistrationWindow'?: (_spacemesh_v1_EventWaitingForPoETRegistrationWindow | null);
  'proofDownloadedFromPoet'?: (_spacemesh_v1_EventProofDownloadedFromPoet | null);
  'registeredInPoet'?: (_spacemesh_v1_EventRegisteredInPoet | null);
  'bestProofSelected'?: (_spacemesh_v1_EventBestProofSelected | null);
  'waitingForPoetRoundEnd'?: (_spacemesh_v1_EventWaitingForPoETRoundEnd | null);
  'details'?: "beacon"|"initStart"|"initComplete"|"postStart"|"postComplete"|"poetWaitRound"|"poetWaitProof"|"atxPublished"|"eligibilities"|"proposal"|"initFailed"|"malfeasance"|"postServiceStarted"|"postServiceStopped"|"waitingForPoetRegistrationWindow"|"proofDownloadedFromPoet"|"registeredInPoet"|"bestProofSelected"|"waitingForPoetRoundEnd";
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
  'initFailed'?: (_spacemesh_v1_EventInitFailed__Output | null);
  'malfeasance'?: (_spacemesh_v1_EventMalfeasance__Output | null);
  'postServiceStarted'?: (_spacemesh_v1_EventPostServiceStarted__Output | null);
  'postServiceStopped'?: (_spacemesh_v1_EventPostServiceStopped__Output | null);
  'waitingForPoetRegistrationWindow'?: (_spacemesh_v1_EventWaitingForPoETRegistrationWindow__Output | null);
  'proofDownloadedFromPoet'?: (_spacemesh_v1_EventProofDownloadedFromPoet__Output | null);
  'registeredInPoet'?: (_spacemesh_v1_EventRegisteredInPoet__Output | null);
  'bestProofSelected'?: (_spacemesh_v1_EventBestProofSelected__Output | null);
  'waitingForPoetRoundEnd'?: (_spacemesh_v1_EventWaitingForPoETRoundEnd__Output | null);
  'details': "beacon"|"initStart"|"initComplete"|"postStart"|"postComplete"|"poetWaitRound"|"poetWaitProof"|"atxPublished"|"eligibilities"|"proposal"|"initFailed"|"malfeasance"|"postServiceStarted"|"postServiceStopped"|"waitingForPoetRegistrationWindow"|"proofDownloadedFromPoet"|"registeredInPoet"|"bestProofSelected"|"waitingForPoetRoundEnd";
}
