import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';


type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  spacemesh: {
    v1: {
      AccountId: MessageTypeDefinition
      Activation: MessageTypeDefinition
      ActivationId: MessageTypeDefinition
      Amount: MessageTypeDefinition
      AppEvent: MessageTypeDefinition
      Block: MessageTypeDefinition
      EpochNumber: MessageTypeDefinition
      GenProofRequest: MessageTypeDefinition
      GenProofResponse: MessageTypeDefinition
      GenProofStatus: EnumTypeDefinition
      Layer: MessageTypeDefinition
      LayerLimits: MessageTypeDefinition
      LayerNumber: MessageTypeDefinition
      MalfeasanceProof: MessageTypeDefinition
      MeshTransaction: MessageTypeDefinition
      Metadata: MessageTypeDefinition
      MetadataRequest: MessageTypeDefinition
      MetadataResponse: MessageTypeDefinition
      NodeRequest: MessageTypeDefinition
      Nonce: MessageTypeDefinition
      Proof: MessageTypeDefinition
      ProofMetadata: MessageTypeDefinition
      Reward: MessageTypeDefinition
      ServiceResponse: MessageTypeDefinition
      SimpleInt: MessageTypeDefinition
      SimpleString: MessageTypeDefinition
      SmesherId: MessageTypeDefinition
      Transaction: MessageTypeDefinition
      TransactionId: MessageTypeDefinition
    }
  }
}

