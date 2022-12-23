// Original file: proto/activation.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetRequest as _spacemesh_v1_GetRequest, GetRequest__Output as _spacemesh_v1_GetRequest__Output } from '../../spacemesh/v1/GetRequest';
import type { GetResponse as _spacemesh_v1_GetResponse, GetResponse__Output as _spacemesh_v1_GetResponse__Output } from '../../spacemesh/v1/GetResponse';

export interface ActivationServiceClient extends grpc.Client {
  Get(argument: _spacemesh_v1_GetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  Get(argument: _spacemesh_v1_GetRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  Get(argument: _spacemesh_v1_GetRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  Get(argument: _spacemesh_v1_GetRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  get(argument: _spacemesh_v1_GetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  get(argument: _spacemesh_v1_GetRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  get(argument: _spacemesh_v1_GetRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  get(argument: _spacemesh_v1_GetRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  
}

export interface ActivationServiceHandlers extends grpc.UntypedServiceImplementation {
  Get: grpc.handleUnaryCall<_spacemesh_v1_GetRequest__Output, _spacemesh_v1_GetResponse>;
  
}

export interface ActivationServiceDefinition extends grpc.ServiceDefinition {
  Get: MethodDefinition<_spacemesh_v1_GetRequest, _spacemesh_v1_GetResponse, _spacemesh_v1_GetRequest__Output, _spacemesh_v1_GetResponse__Output>
}
