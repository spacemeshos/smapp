import type { MessageTypeDefinition } from '@grpc/proto-loader';

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
      Layer: MessageTypeDefinition
      LayerLimits: MessageTypeDefinition
      LayerNumber: MessageTypeDefinition
      MeshTransaction: MessageTypeDefinition
      Nonce: MessageTypeDefinition
      Reward: MessageTypeDefinition
      SimpleInt: MessageTypeDefinition
      SimpleString: MessageTypeDefinition
      SmesherId: MessageTypeDefinition
      SubmitTransactionRequest: MessageTypeDefinition
      SubmitTransactionResponse: MessageTypeDefinition
      Transaction: MessageTypeDefinition
      TransactionId: MessageTypeDefinition
      TransactionResult: MessageTypeDefinition
      TransactionResultsRequest: MessageTypeDefinition
      TransactionState: MessageTypeDefinition
      TransactionsIds: MessageTypeDefinition
      TransactionsStateRequest: MessageTypeDefinition
      TransactionsStateResponse: MessageTypeDefinition
      TransactionsStateStreamRequest: MessageTypeDefinition
      TransactionsStateStreamResponse: MessageTypeDefinition
    }
  }
}

