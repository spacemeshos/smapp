import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';


type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Duration: MessageTypeDefinition
      Timestamp: MessageTypeDefinition
    }
  }
  spacemesh: {
    v1: {
      CheckpointStreamRequest: MessageTypeDefinition
      CheckpointStreamResponse: MessageTypeDefinition
      Event: MessageTypeDefinition
      EventAtxPubished: MessageTypeDefinition
      EventBeacon: MessageTypeDefinition
      EventEligibilities: MessageTypeDefinition
      EventInitComplete: MessageTypeDefinition
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

