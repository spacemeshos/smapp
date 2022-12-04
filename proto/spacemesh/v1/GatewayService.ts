// Original file: proto/gateway.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BroadcastPoetRequest as _spacemesh_v1_BroadcastPoetRequest, BroadcastPoetRequest__Output as _spacemesh_v1_BroadcastPoetRequest__Output } from '../../spacemesh/v1/BroadcastPoetRequest';
import type { BroadcastPoetResponse as _spacemesh_v1_BroadcastPoetResponse, BroadcastPoetResponse__Output as _spacemesh_v1_BroadcastPoetResponse__Output } from '../../spacemesh/v1/BroadcastPoetResponse';

export interface GatewayServiceClient extends grpc.Client {
  BroadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  BroadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  BroadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  BroadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  broadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  broadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  broadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  broadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  
}

export interface GatewayServiceHandlers extends grpc.UntypedServiceImplementation {
  BroadcastPoet: grpc.handleUnaryCall<_spacemesh_v1_BroadcastPoetRequest__Output, _spacemesh_v1_BroadcastPoetResponse>;
  
}

export interface GatewayServiceDefinition extends grpc.ServiceDefinition {
  BroadcastPoet: MethodDefinition<_spacemesh_v1_BroadcastPoetRequest, _spacemesh_v1_BroadcastPoetResponse, _spacemesh_v1_BroadcastPoetRequest__Output, _spacemesh_v1_BroadcastPoetResponse__Output>
}
