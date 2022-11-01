import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Any: MessageTypeDefinition
    }
    rpc: {
      Status: MessageTypeDefinition
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
      NodeStatus: MessageTypeDefinition
      Nonce: MessageTypeDefinition
      Reward: MessageTypeDefinition
      ShutdownRequest: MessageTypeDefinition
      ShutdownResponse: MessageTypeDefinition
      SimpleInt: MessageTypeDefinition
      SimpleString: MessageTypeDefinition
      SmesherId: MessageTypeDefinition
      StatusRequest: MessageTypeDefinition
      StatusResponse: MessageTypeDefinition
      StatusStreamRequest: MessageTypeDefinition
      StatusStreamResponse: MessageTypeDefinition
      SyncStartRequest: MessageTypeDefinition
      SyncStartResponse: MessageTypeDefinition
      Transaction: MessageTypeDefinition
      TransactionId: MessageTypeDefinition
      UpdatePoetServersRequest: MessageTypeDefinition
      UpdatePoetServersResponse: MessageTypeDefinition
      VersionResponse: MessageTypeDefinition
    }
  }
}

