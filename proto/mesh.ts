import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { MeshServiceClient as _spacemesh_v1_MeshServiceClient, MeshServiceDefinition as _spacemesh_v1_MeshServiceDefinition } from './spacemesh/v1/MeshService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  spacemesh: {
    v1: {
      AccountId: MessageTypeDefinition
      AccountMeshData: MessageTypeDefinition
      AccountMeshDataFilter: MessageTypeDefinition
      AccountMeshDataFlag: EnumTypeDefinition
      AccountMeshDataQueryRequest: MessageTypeDefinition
      AccountMeshDataQueryResponse: MessageTypeDefinition
      AccountMeshDataStreamRequest: MessageTypeDefinition
      AccountMeshDataStreamResponse: MessageTypeDefinition
      Activation: MessageTypeDefinition
      ActivationId: MessageTypeDefinition
      Amount: MessageTypeDefinition
      AppEvent: MessageTypeDefinition
      Block: MessageTypeDefinition
      CoinTransferTransaction: MessageTypeDefinition
      CurrentEpochRequest: MessageTypeDefinition
      CurrentEpochResponse: MessageTypeDefinition
      CurrentLayerRequest: MessageTypeDefinition
      CurrentLayerResponse: MessageTypeDefinition
      EpochNumLayersRequest: MessageTypeDefinition
      EpochNumLayersResponse: MessageTypeDefinition
      GasOffered: MessageTypeDefinition
      GenesisTimeRequest: MessageTypeDefinition
      GenesisTimeResponse: MessageTypeDefinition
      Layer: MessageTypeDefinition
      LayerDurationRequest: MessageTypeDefinition
      LayerDurationResponse: MessageTypeDefinition
      LayerNumber: MessageTypeDefinition
      LayerStreamRequest: MessageTypeDefinition
      LayerStreamResponse: MessageTypeDefinition
      LayersQueryRequest: MessageTypeDefinition
      LayersQueryResponse: MessageTypeDefinition
      MaxTransactionsPerSecondRequest: MessageTypeDefinition
      MaxTransactionsPerSecondResponse: MessageTypeDefinition
      MeshService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_MeshServiceClient> & { service: _spacemesh_v1_MeshServiceDefinition }
      NetIDRequest: MessageTypeDefinition
      NetIDResponse: MessageTypeDefinition
      Reward: MessageTypeDefinition
      Signature: MessageTypeDefinition
      SimpleInt: MessageTypeDefinition
      SimpleString: MessageTypeDefinition
      SmartContractTransaction: MessageTypeDefinition
      SmesherId: MessageTypeDefinition
      Transaction: MessageTypeDefinition
      TransactionId: MessageTypeDefinition
    }
  }
}

