import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { SmesherServiceClient as _spacemesh_v1_SmesherServiceClient, SmesherServiceDefinition as _spacemesh_v1_SmesherServiceDefinition } from './spacemesh/v1/SmesherService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Any: MessageTypeDefinition
      Empty: MessageTypeDefinition
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
      EstimatedRewardsRequest: MessageTypeDefinition
      EstimatedRewardsResponse: MessageTypeDefinition
      GasOffered: MessageTypeDefinition
      IsSmeshingResponse: MessageTypeDefinition
      Layer: MessageTypeDefinition
      LayerNumber: MessageTypeDefinition
      MeshTransaction: MessageTypeDefinition
      MinGasResponse: MessageTypeDefinition
      PostConfigResponse: MessageTypeDefinition
      PostSetupComputeProvider: MessageTypeDefinition
      PostSetupComputeProvidersRequest: MessageTypeDefinition
      PostSetupComputeProvidersResponse: MessageTypeDefinition
      PostSetupOpts: MessageTypeDefinition
      PostSetupStatus: MessageTypeDefinition
      PostSetupStatusResponse: MessageTypeDefinition
      PostSetupStatusStreamResponse: MessageTypeDefinition
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
      SmesherService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_SmesherServiceClient> & { service: _spacemesh_v1_SmesherServiceDefinition }
      StartSmeshingRequest: MessageTypeDefinition
      StartSmeshingResponse: MessageTypeDefinition
      StopSmeshingRequest: MessageTypeDefinition
      StopSmeshingResponse: MessageTypeDefinition
      Transaction: MessageTypeDefinition
      TransactionId: MessageTypeDefinition
    }
  }
}

