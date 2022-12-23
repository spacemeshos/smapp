import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { ActivationServiceClient as _spacemesh_v1_ActivationServiceClient, ActivationServiceDefinition as _spacemesh_v1_ActivationServiceDefinition } from './spacemesh/v1/ActivationService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  spacemesh: {
    v1: {
      AccountId: MessageTypeDefinition
      Activation: MessageTypeDefinition
      ActivationId: MessageTypeDefinition
      ActivationService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_ActivationServiceClient> & { service: _spacemesh_v1_ActivationServiceDefinition }
      Amount: MessageTypeDefinition
      AppEvent: MessageTypeDefinition
      Block: MessageTypeDefinition
      GetRequest: MessageTypeDefinition
      GetResponse: MessageTypeDefinition
      Layer: MessageTypeDefinition
      LayerLimits: MessageTypeDefinition
      LayerNumber: MessageTypeDefinition
      MeshTransaction: MessageTypeDefinition
      Nonce: MessageTypeDefinition
      Reward: MessageTypeDefinition
      SimpleInt: MessageTypeDefinition
      SimpleString: MessageTypeDefinition
      SmesherId: MessageTypeDefinition
      Transaction: MessageTypeDefinition
      TransactionId: MessageTypeDefinition
    }
  }
}

