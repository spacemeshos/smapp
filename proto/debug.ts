import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { DebugServiceClient as _spacemesh_v1_DebugServiceClient, DebugServiceDefinition as _spacemesh_v1_DebugServiceDefinition } from './spacemesh/v1/DebugService';

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
      AccountsResponse: MessageTypeDefinition
      Activation: MessageTypeDefinition
      ActivationId: MessageTypeDefinition
      Amount: MessageTypeDefinition
      AppEvent: MessageTypeDefinition
      AppEventStreamRequest: MessageTypeDefinition
      AppEventStreamResponse: MessageTypeDefinition
      Block: MessageTypeDefinition
      DebugService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_DebugServiceClient> & { service: _spacemesh_v1_DebugServiceDefinition }
      Eligibility: MessageTypeDefinition
      EpochData: MessageTypeDefinition
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
      NetworkInfoResponse: MessageTypeDefinition
      Nonce: MessageTypeDefinition
      Proposal: MessageTypeDefinition
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

