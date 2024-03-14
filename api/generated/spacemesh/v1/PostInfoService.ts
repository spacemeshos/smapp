// Original file: vendor/api/spacemesh/v1/post.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { PostStatesRequest as _spacemesh_v1_PostStatesRequest, PostStatesRequest__Output as _spacemesh_v1_PostStatesRequest__Output } from '../../spacemesh/v1/PostStatesRequest';
import type { PostStatesResponse as _spacemesh_v1_PostStatesResponse, PostStatesResponse__Output as _spacemesh_v1_PostStatesResponse__Output } from '../../spacemesh/v1/PostStatesResponse';

export interface PostInfoServiceClient extends grpc.Client {
  PostStates(argument: _spacemesh_v1_PostStatesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatesResponse__Output) => void): grpc.ClientUnaryCall;
  PostStates(argument: _spacemesh_v1_PostStatesRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatesResponse__Output) => void): grpc.ClientUnaryCall;
  PostStates(argument: _spacemesh_v1_PostStatesRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatesResponse__Output) => void): grpc.ClientUnaryCall;
  PostStates(argument: _spacemesh_v1_PostStatesRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatesResponse__Output) => void): grpc.ClientUnaryCall;
  postStates(argument: _spacemesh_v1_PostStatesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatesResponse__Output) => void): grpc.ClientUnaryCall;
  postStates(argument: _spacemesh_v1_PostStatesRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatesResponse__Output) => void): grpc.ClientUnaryCall;
  postStates(argument: _spacemesh_v1_PostStatesRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatesResponse__Output) => void): grpc.ClientUnaryCall;
  postStates(argument: _spacemesh_v1_PostStatesRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatesResponse__Output) => void): grpc.ClientUnaryCall;
  
}

export interface PostInfoServiceHandlers extends grpc.UntypedServiceImplementation {
  PostStates: grpc.handleUnaryCall<_spacemesh_v1_PostStatesRequest__Output, _spacemesh_v1_PostStatesResponse>;
  
}

export interface PostInfoServiceDefinition extends grpc.ServiceDefinition {
  PostStates: MethodDefinition<_spacemesh_v1_PostStatesRequest, _spacemesh_v1_PostStatesResponse, _spacemesh_v1_PostStatesRequest__Output, _spacemesh_v1_PostStatesResponse__Output>
}
