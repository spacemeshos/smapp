// Original file: vendor/api/spacemesh/v1/activation.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../google/protobuf/Empty';
import type { GetRequest as _spacemesh_v1_GetRequest, GetRequest__Output as _spacemesh_v1_GetRequest__Output } from '../../spacemesh/v1/GetRequest';
import type { GetResponse as _spacemesh_v1_GetResponse, GetResponse__Output as _spacemesh_v1_GetResponse__Output } from '../../spacemesh/v1/GetResponse';
import type { HighestResponse as _spacemesh_v1_HighestResponse, HighestResponse__Output as _spacemesh_v1_HighestResponse__Output } from '../../spacemesh/v1/HighestResponse';

export interface ActivationServiceClient extends grpc.Client {
  Get(argument: _spacemesh_v1_GetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  Get(argument: _spacemesh_v1_GetRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  Get(argument: _spacemesh_v1_GetRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  Get(argument: _spacemesh_v1_GetRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  get(argument: _spacemesh_v1_GetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  get(argument: _spacemesh_v1_GetRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  get(argument: _spacemesh_v1_GetRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  get(argument: _spacemesh_v1_GetRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GetResponse__Output) => void): grpc.ClientUnaryCall;
  
  Highest(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_HighestResponse__Output) => void): grpc.ClientUnaryCall;
  Highest(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_HighestResponse__Output) => void): grpc.ClientUnaryCall;
  Highest(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_HighestResponse__Output) => void): grpc.ClientUnaryCall;
  Highest(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_HighestResponse__Output) => void): grpc.ClientUnaryCall;
  highest(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_HighestResponse__Output) => void): grpc.ClientUnaryCall;
  highest(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_HighestResponse__Output) => void): grpc.ClientUnaryCall;
  highest(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_HighestResponse__Output) => void): grpc.ClientUnaryCall;
  highest(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_HighestResponse__Output) => void): grpc.ClientUnaryCall;
  
}

export interface ActivationServiceHandlers extends grpc.UntypedServiceImplementation {
  Get: grpc.handleUnaryCall<_spacemesh_v1_GetRequest__Output, _spacemesh_v1_GetResponse>;
  
  Highest: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _spacemesh_v1_HighestResponse>;
  
}

export interface ActivationServiceDefinition extends grpc.ServiceDefinition {
  Get: MethodDefinition<_spacemesh_v1_GetRequest, _spacemesh_v1_GetResponse, _spacemesh_v1_GetRequest__Output, _spacemesh_v1_GetResponse__Output>
  Highest: MethodDefinition<_google_protobuf_Empty, _spacemesh_v1_HighestResponse, _google_protobuf_Empty__Output, _spacemesh_v1_HighestResponse__Output>
}
