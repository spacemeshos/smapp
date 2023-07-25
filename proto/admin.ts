import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { AdminServiceClient as _spacemesh_v1_AdminServiceClient, AdminServiceDefinition as _spacemesh_v1_AdminServiceDefinition } from './spacemesh/v1/AdminService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Duration: MessageTypeDefinition
      Empty: MessageTypeDefinition
      Timestamp: MessageTypeDefinition
    }
  }
  spacemesh: {
    v1: {
      AdminService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_AdminServiceClient> & { service: _spacemesh_v1_AdminServiceDefinition }
      CheckpointStreamRequest: MessageTypeDefinition
      CheckpointStreamResponse: MessageTypeDefinition
      Event: MessageTypeDefinition
      EventAtxPubished: MessageTypeDefinition
      EventBeacon: MessageTypeDefinition
      EventEligibilities: MessageTypeDefinition
      EventInitComplete: MessageTypeDefinition
      EventInitFailed: MessageTypeDefinition
      EventInitStart: MessageTypeDefinition
      EventPoetWaitProof: MessageTypeDefinition
      EventPoetWaitRound: MessageTypeDefinition
      EventPostComplete: MessageTypeDefinition
      EventPostStart: MessageTypeDefinition
      EventProposal: MessageTypeDefinition
      EventStreamRequest: MessageTypeDefinition
      ProposalEligibility: MessageTypeDefinition
      RecoverRequest: MessageTypeDefinition
    }
  }
}

