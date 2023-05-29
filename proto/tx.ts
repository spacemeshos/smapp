import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { TransactionServiceClient as _spacemesh_v1_TransactionServiceClient, TransactionServiceDefinition as _spacemesh_v1_TransactionServiceDefinition } from './spacemesh/v1/TransactionService';

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
      EpochNumber: MessageTypeDefinition
      Layer: MessageTypeDefinition
      LayerLimits: MessageTypeDefinition
      LayerNumber: MessageTypeDefinition
      MeshTransaction: MessageTypeDefinition
      Nonce: MessageTypeDefinition
      ParseTransactionRequest: MessageTypeDefinition
      ParseTransactionResponse: MessageTypeDefinition
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
      TransactionService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_TransactionServiceClient> & { service: _spacemesh_v1_TransactionServiceDefinition }
      TransactionState: MessageTypeDefinition
      TransactionsIds: MessageTypeDefinition
      TransactionsStateRequest: MessageTypeDefinition
      TransactionsStateResponse: MessageTypeDefinition
      TransactionsStateStreamRequest: MessageTypeDefinition
      TransactionsStateStreamResponse: MessageTypeDefinition
    }
  }
}

