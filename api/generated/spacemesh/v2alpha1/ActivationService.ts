// Original file: vendor/api/spacemesh/v2alpha1/activation.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ActivationList as _spacemesh_v2alpha1_ActivationList, ActivationList__Output as _spacemesh_v2alpha1_ActivationList__Output } from '../../spacemesh/v2alpha1/ActivationList';
import type { ActivationRequest as _spacemesh_v2alpha1_ActivationRequest, ActivationRequest__Output as _spacemesh_v2alpha1_ActivationRequest__Output } from '../../spacemesh/v2alpha1/ActivationRequest';
import type { ActivationsCountRequest as _spacemesh_v2alpha1_ActivationsCountRequest, ActivationsCountRequest__Output as _spacemesh_v2alpha1_ActivationsCountRequest__Output } from '../../spacemesh/v2alpha1/ActivationsCountRequest';
import type { ActivationsCountResponse as _spacemesh_v2alpha1_ActivationsCountResponse, ActivationsCountResponse__Output as _spacemesh_v2alpha1_ActivationsCountResponse__Output } from '../../spacemesh/v2alpha1/ActivationsCountResponse';

export interface ActivationServiceClient extends grpc.Client {
  ActivationsCount(argument: _spacemesh_v2alpha1_ActivationsCountRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationsCountResponse__Output) => void): grpc.ClientUnaryCall;
  ActivationsCount(argument: _spacemesh_v2alpha1_ActivationsCountRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationsCountResponse__Output) => void): grpc.ClientUnaryCall;
  ActivationsCount(argument: _spacemesh_v2alpha1_ActivationsCountRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationsCountResponse__Output) => void): grpc.ClientUnaryCall;
  ActivationsCount(argument: _spacemesh_v2alpha1_ActivationsCountRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationsCountResponse__Output) => void): grpc.ClientUnaryCall;
  activationsCount(argument: _spacemesh_v2alpha1_ActivationsCountRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationsCountResponse__Output) => void): grpc.ClientUnaryCall;
  activationsCount(argument: _spacemesh_v2alpha1_ActivationsCountRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationsCountResponse__Output) => void): grpc.ClientUnaryCall;
  activationsCount(argument: _spacemesh_v2alpha1_ActivationsCountRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationsCountResponse__Output) => void): grpc.ClientUnaryCall;
  activationsCount(argument: _spacemesh_v2alpha1_ActivationsCountRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationsCountResponse__Output) => void): grpc.ClientUnaryCall;
  
  List(argument: _spacemesh_v2alpha1_ActivationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationList__Output) => void): grpc.ClientUnaryCall;
  List(argument: _spacemesh_v2alpha1_ActivationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationList__Output) => void): grpc.ClientUnaryCall;
  List(argument: _spacemesh_v2alpha1_ActivationRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationList__Output) => void): grpc.ClientUnaryCall;
  List(argument: _spacemesh_v2alpha1_ActivationRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationList__Output) => void): grpc.ClientUnaryCall;
  list(argument: _spacemesh_v2alpha1_ActivationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationList__Output) => void): grpc.ClientUnaryCall;
  list(argument: _spacemesh_v2alpha1_ActivationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationList__Output) => void): grpc.ClientUnaryCall;
  list(argument: _spacemesh_v2alpha1_ActivationRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationList__Output) => void): grpc.ClientUnaryCall;
  list(argument: _spacemesh_v2alpha1_ActivationRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_ActivationList__Output) => void): grpc.ClientUnaryCall;
  
}

export interface ActivationServiceHandlers extends grpc.UntypedServiceImplementation {
  ActivationsCount: grpc.handleUnaryCall<_spacemesh_v2alpha1_ActivationsCountRequest__Output, _spacemesh_v2alpha1_ActivationsCountResponse>;
  
  List: grpc.handleUnaryCall<_spacemesh_v2alpha1_ActivationRequest__Output, _spacemesh_v2alpha1_ActivationList>;
  
}

export interface ActivationServiceDefinition extends grpc.ServiceDefinition {
  ActivationsCount: MethodDefinition<_spacemesh_v2alpha1_ActivationsCountRequest, _spacemesh_v2alpha1_ActivationsCountResponse, _spacemesh_v2alpha1_ActivationsCountRequest__Output, _spacemesh_v2alpha1_ActivationsCountResponse__Output>
  List: MethodDefinition<_spacemesh_v2alpha1_ActivationRequest, _spacemesh_v2alpha1_ActivationList, _spacemesh_v2alpha1_ActivationRequest__Output, _spacemesh_v2alpha1_ActivationList__Output>
}
