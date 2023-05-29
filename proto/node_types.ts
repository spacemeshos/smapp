import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';


type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

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
      CoinTransferTransaction: MessageTypeDefinition
      EchoRequest: MessageTypeDefinition
      EchoResponse: MessageTypeDefinition
      ErrorStreamRequest: MessageTypeDefinition
      ErrorStreamResponse: MessageTypeDefinition
      GasOffered: MessageTypeDefinition
      Layer: MessageTypeDefinition
      LayerNumber: MessageTypeDefinition
      LogLevel: EnumTypeDefinition
      MeshTransaction: MessageTypeDefinition
      NodeError: MessageTypeDefinition
      NodeStatus: MessageTypeDefinition
      Reward: MessageTypeDefinition
      ShutdownRequest: MessageTypeDefinition
      ShutdownResponse: MessageTypeDefinition
      Signature: MessageTypeDefinition
      SimpleInt: MessageTypeDefinition
      SimpleString: MessageTypeDefinition
      SmartContractTransaction: MessageTypeDefinition
      SmesherId: MessageTypeDefinition
      StatusRequest: MessageTypeDefinition
      StatusResponse: MessageTypeDefinition
      StatusStreamRequest: MessageTypeDefinition
      StatusStreamResponse: MessageTypeDefinition
      SyncStartRequest: MessageTypeDefinition
      SyncStartResponse: MessageTypeDefinition
      Transaction: MessageTypeDefinition
      TransactionId: MessageTypeDefinition
      UpdatePoetServerRequest: MessageTypeDefinition
      UpdatePoetServerResponse: MessageTypeDefinition
      VersionResponse: MessageTypeDefinition
    }
  }
}

