// Original file: vendor/api/spacemesh/v2alpha1/activation.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Activation as _spacemesh_v2alpha1_Activation, Activation__Output as _spacemesh_v2alpha1_Activation__Output } from '../../spacemesh/v2alpha1/Activation';
import type { ActivationStreamRequest as _spacemesh_v2alpha1_ActivationStreamRequest, ActivationStreamRequest__Output as _spacemesh_v2alpha1_ActivationStreamRequest__Output } from '../../spacemesh/v2alpha1/ActivationStreamRequest';

export interface ActivationStreamServiceClient extends grpc.Client {
  Stream(argument: _spacemesh_v2alpha1_ActivationStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v2alpha1_Activation__Output>;
  Stream(argument: _spacemesh_v2alpha1_ActivationStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v2alpha1_Activation__Output>;
  stream(argument: _spacemesh_v2alpha1_ActivationStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v2alpha1_Activation__Output>;
  stream(argument: _spacemesh_v2alpha1_ActivationStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v2alpha1_Activation__Output>;
  
}

export interface ActivationStreamServiceHandlers extends grpc.UntypedServiceImplementation {
  Stream: grpc.handleServerStreamingCall<_spacemesh_v2alpha1_ActivationStreamRequest__Output, _spacemesh_v2alpha1_Activation>;
  
}

export interface ActivationStreamServiceDefinition extends grpc.ServiceDefinition {
  Stream: MethodDefinition<_spacemesh_v2alpha1_ActivationStreamRequest, _spacemesh_v2alpha1_Activation, _spacemesh_v2alpha1_ActivationStreamRequest__Output, _spacemesh_v2alpha1_Activation__Output>
}
