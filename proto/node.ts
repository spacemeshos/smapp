import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { NodeServiceClient as _spacemesh_v1_NodeServiceClient, NodeServiceDefinition as _spacemesh_v1_NodeServiceDefinition } from './spacemesh/v1/NodeService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Empty: MessageTypeDefinition
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
      BuildResponse: MessageTypeDefinition
      EchoRequest: MessageTypeDefinition
      EchoResponse: MessageTypeDefinition
      ErrorStreamRequest: MessageTypeDefinition
      ErrorStreamResponse: MessageTypeDefinition
      Layer: MessageTypeDefinition
      LayerLimits: MessageTypeDefinition
      LayerNumber: MessageTypeDefinition
      LogLevel: EnumTypeDefinition
      MeshTransaction: MessageTypeDefinition
      NodeError: MessageTypeDefinition
      NodeService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_NodeServiceClient> & { service: _spacemesh_v1_NodeServiceDefinition }
      NodeStatus: MessageTypeDefinition
      Nonce: MessageTypeDefinition
      Reward: MessageTypeDefinition
      SimpleInt: MessageTypeDefinition
      SimpleString: MessageTypeDefinition
      SmesherId: MessageTypeDefinition
      StatusRequest: MessageTypeDefinition
      StatusResponse: MessageTypeDefinition
      StatusStreamRequest: MessageTypeDefinition
      StatusStreamResponse: MessageTypeDefinition
      Transaction: MessageTypeDefinition
      TransactionId: MessageTypeDefinition
      VersionResponse: MessageTypeDefinition
    }
  }
}

