// Original file: proto/post.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { NodeRequest as _spacemesh_v1_NodeRequest, NodeRequest__Output as _spacemesh_v1_NodeRequest__Output } from '../../spacemesh/v1/NodeRequest';
import type { ServiceResponse as _spacemesh_v1_ServiceResponse, ServiceResponse__Output as _spacemesh_v1_ServiceResponse__Output } from '../../spacemesh/v1/ServiceResponse';

export interface PostServiceClient extends grpc.Client {
  Register(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_spacemesh_v1_ServiceResponse, _spacemesh_v1_NodeRequest__Output>;
  Register(options?: grpc.CallOptions): grpc.ClientDuplexStream<_spacemesh_v1_ServiceResponse, _spacemesh_v1_NodeRequest__Output>;
  register(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_spacemesh_v1_ServiceResponse, _spacemesh_v1_NodeRequest__Output>;
  register(options?: grpc.CallOptions): grpc.ClientDuplexStream<_spacemesh_v1_ServiceResponse, _spacemesh_v1_NodeRequest__Output>;
  
}

export interface PostServiceHandlers extends grpc.UntypedServiceImplementation {
  Register: grpc.handleBidiStreamingCall<_spacemesh_v1_ServiceResponse__Output, _spacemesh_v1_NodeRequest>;
  
}

export interface PostServiceDefinition extends grpc.ServiceDefinition {
  Register: MethodDefinition<_spacemesh_v1_ServiceResponse, _spacemesh_v1_NodeRequest, _spacemesh_v1_ServiceResponse__Output, _spacemesh_v1_NodeRequest__Output>
}
