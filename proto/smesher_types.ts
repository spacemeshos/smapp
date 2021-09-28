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
      CoinTransferTransaction: MessageTypeDefinition
      CoinbaseResponse: MessageTypeDefinition
      ComputeApiClass: EnumTypeDefinition
      ConfigResponse: MessageTypeDefinition
      CreatePostDataRequest: MessageTypeDefinition
      EstimatedRewardsRequest: MessageTypeDefinition
      EstimatedRewardsResponse: MessageTypeDefinition
      GasOffered: MessageTypeDefinition
      IsSmeshingResponse: MessageTypeDefinition
      Layer: MessageTypeDefinition
      LayerNumber: MessageTypeDefinition
      MinGasResponse: MessageTypeDefinition
      PostComputeProvider: MessageTypeDefinition
      PostComputeProvidersRequest: MessageTypeDefinition
      PostComputeProvidersResponse: MessageTypeDefinition
      PostDataCreationProgressStreamResponse: MessageTypeDefinition
      PostInitOpts: MessageTypeDefinition
      PostStatus: MessageTypeDefinition
      PostStatusResponse: MessageTypeDefinition
      Reward: MessageTypeDefinition
      SetCoinbaseRequest: MessageTypeDefinition
      SetCoinbaseResponse: MessageTypeDefinition
      SetMinGasRequest: MessageTypeDefinition
      SetMinGasResponse: MessageTypeDefinition
      Signature: MessageTypeDefinition
      SimpleInt: MessageTypeDefinition
      SimpleString: MessageTypeDefinition
      SmartContractTransaction: MessageTypeDefinition
      SmesherIDResponse: MessageTypeDefinition
      SmesherId: MessageTypeDefinition
      StartSmeshingRequest: MessageTypeDefinition
      StartSmeshingResponse: MessageTypeDefinition
      StopSmeshingRequest: MessageTypeDefinition
      StopSmeshingResponse: MessageTypeDefinition
      Transaction: MessageTypeDefinition
      TransactionId: MessageTypeDefinition
    }
  }
}

