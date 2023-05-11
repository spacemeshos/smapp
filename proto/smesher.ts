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
      CoinbaseResponse: MessageTypeDefinition
      EpochNumber: MessageTypeDefinition
      EstimatedRewardsRequest: MessageTypeDefinition
      EstimatedRewardsResponse: MessageTypeDefinition
      IsSmeshingResponse: MessageTypeDefinition
      Layer: MessageTypeDefinition
      LayerLimits: MessageTypeDefinition
      LayerNumber: MessageTypeDefinition
      MeshTransaction: MessageTypeDefinition
      MinGasResponse: MessageTypeDefinition
      Nonce: MessageTypeDefinition
      PostConfigResponse: MessageTypeDefinition
      PostSetupOpts: MessageTypeDefinition
      PostSetupProvider: MessageTypeDefinition
      PostSetupProvidersRequest: MessageTypeDefinition
      PostSetupProvidersResponse: MessageTypeDefinition
      PostSetupStatus: MessageTypeDefinition
      PostSetupStatusResponse: MessageTypeDefinition
      PostSetupStatusStreamResponse: MessageTypeDefinition
      Reward: MessageTypeDefinition
      SetCoinbaseRequest: MessageTypeDefinition
      SetCoinbaseResponse: MessageTypeDefinition
      SetMinGasRequest: MessageTypeDefinition
      SetMinGasResponse: MessageTypeDefinition
      SimpleInt: MessageTypeDefinition
      SimpleString: MessageTypeDefinition
      SmesherIDResponse: MessageTypeDefinition
      SmesherId: MessageTypeDefinition
      SmesherService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_SmesherServiceClient> & { service: _spacemesh_v1_SmesherServiceDefinition }
      StartSmeshingRequest: MessageTypeDefinition
      StartSmeshingResponse: MessageTypeDefinition
      StopSmeshingRequest: MessageTypeDefinition
      StopSmeshingResponse: MessageTypeDefinition
      Transaction: MessageTypeDefinition
      TransactionId: MessageTypeDefinition
      UpdatePoetServersRequest: MessageTypeDefinition
      UpdatePoetServersResponse: MessageTypeDefinition
    }
  }
}

