import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { GatewayServiceClient as _spacemesh_v1_GatewayServiceClient, GatewayServiceDefinition as _spacemesh_v1_GatewayServiceDefinition } from './spacemesh/v1/GatewayService';

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
      BroadcastPoetRequest: MessageTypeDefinition
      BroadcastPoetResponse: MessageTypeDefinition
      GatewayService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_GatewayServiceClient> & { service: _spacemesh_v1_GatewayServiceDefinition }
    }
  }
}

