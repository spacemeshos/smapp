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
      AccountId: MessageTypeDefinition
      Activation: MessageTypeDefinition
      ActivationId: MessageTypeDefinition
      Amount: MessageTypeDefinition
      AppEvent: MessageTypeDefinition
      Block: MessageTypeDefinition
      CheckpointStreamRequest: MessageTypeDefinition
      CheckpointStreamResponse: MessageTypeDefinition
      ConnectionInfo: MessageTypeDefinition
      EpochNumber: MessageTypeDefinition
      Event: MessageTypeDefinition
      EventAtxPubished: MessageTypeDefinition
      EventBeacon: MessageTypeDefinition
      EventEligibilities: MessageTypeDefinition
      EventInitComplete: MessageTypeDefinition
      EventInitFailed: MessageTypeDefinition
      EventInitStart: MessageTypeDefinition
      EventMalfeasance: MessageTypeDefinition
      EventPoetWaitProof: MessageTypeDefinition
      EventPoetWaitRound: MessageTypeDefinition
      EventPostComplete: MessageTypeDefinition
      EventPostServiceStarted: MessageTypeDefinition
      EventPostServiceStopped: MessageTypeDefinition
      EventPostStart: MessageTypeDefinition
      EventProposal: MessageTypeDefinition
      EventStreamRequest: MessageTypeDefinition
      Layer: MessageTypeDefinition
      LayerLimits: MessageTypeDefinition
      LayerNumber: MessageTypeDefinition
      MalfeasanceProof: MessageTypeDefinition
      MeshTransaction: MessageTypeDefinition
      Nonce: MessageTypeDefinition
      PeerInfo: MessageTypeDefinition
      ProposalEligibility: MessageTypeDefinition
      RecoverRequest: MessageTypeDefinition
      Reward: MessageTypeDefinition
      SimpleInt: MessageTypeDefinition
      SimpleString: MessageTypeDefinition
      SmesherId: MessageTypeDefinition
      Transaction: MessageTypeDefinition
      TransactionId: MessageTypeDefinition
    }
  }
}

