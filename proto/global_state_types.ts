import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

export interface ProtoGrpcType {
  spacemesh: {
    v1: {
      Account: MessageTypeDefinition
      AccountData: MessageTypeDefinition
      AccountDataFilter: MessageTypeDefinition
      AccountDataFlag: EnumTypeDefinition
      AccountDataQueryRequest: MessageTypeDefinition
      AccountDataQueryResponse: MessageTypeDefinition
      AccountDataStreamRequest: MessageTypeDefinition
      AccountDataStreamResponse: MessageTypeDefinition
      AccountId: MessageTypeDefinition
      AccountRequest: MessageTypeDefinition
      AccountResponse: MessageTypeDefinition
      AccountState: MessageTypeDefinition
      Activation: MessageTypeDefinition
      ActivationId: MessageTypeDefinition
      Amount: MessageTypeDefinition
      AppEvent: MessageTypeDefinition
      AppEventStreamRequest: MessageTypeDefinition
      AppEventStreamResponse: MessageTypeDefinition
      Block: MessageTypeDefinition
      GlobalStateData: MessageTypeDefinition
      GlobalStateDataFlag: EnumTypeDefinition
      GlobalStateHash: MessageTypeDefinition
      GlobalStateHashRequest: MessageTypeDefinition
      GlobalStateHashResponse: MessageTypeDefinition
      GlobalStateStreamRequest: MessageTypeDefinition
      GlobalStateStreamResponse: MessageTypeDefinition
      Layer: MessageTypeDefinition
      LayerLimits: MessageTypeDefinition
      LayerNumber: MessageTypeDefinition
      MeshTransaction: MessageTypeDefinition
      Nonce: MessageTypeDefinition
      Reward: MessageTypeDefinition
      SimpleInt: MessageTypeDefinition
      SimpleString: MessageTypeDefinition
      SmesherDataQueryRequest: MessageTypeDefinition
      SmesherDataQueryResponse: MessageTypeDefinition
      SmesherId: MessageTypeDefinition
      SmesherRewardStreamRequest: MessageTypeDefinition
      SmesherRewardStreamResponse: MessageTypeDefinition
      Transaction: MessageTypeDefinition
      TransactionId: MessageTypeDefinition
      TransactionReceipt: MessageTypeDefinition
    }
  }
}

