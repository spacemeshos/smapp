// Original file: vendor/api/spacemesh/v2alpha1/reward.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Reward as _spacemesh_v2alpha1_Reward, Reward__Output as _spacemesh_v2alpha1_Reward__Output } from '../../spacemesh/v2alpha1/Reward';
import type { RewardStreamRequest as _spacemesh_v2alpha1_RewardStreamRequest, RewardStreamRequest__Output as _spacemesh_v2alpha1_RewardStreamRequest__Output } from '../../spacemesh/v2alpha1/RewardStreamRequest';

export interface RewardStreamServiceClient extends grpc.Client {
  Stream(argument: _spacemesh_v2alpha1_RewardStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v2alpha1_Reward__Output>;
  Stream(argument: _spacemesh_v2alpha1_RewardStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v2alpha1_Reward__Output>;
  stream(argument: _spacemesh_v2alpha1_RewardStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v2alpha1_Reward__Output>;
  stream(argument: _spacemesh_v2alpha1_RewardStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v2alpha1_Reward__Output>;
  
}

export interface RewardStreamServiceHandlers extends grpc.UntypedServiceImplementation {
  Stream: grpc.handleServerStreamingCall<_spacemesh_v2alpha1_RewardStreamRequest__Output, _spacemesh_v2alpha1_Reward>;
  
}

export interface RewardStreamServiceDefinition extends grpc.ServiceDefinition {
  Stream: MethodDefinition<_spacemesh_v2alpha1_RewardStreamRequest, _spacemesh_v2alpha1_Reward, _spacemesh_v2alpha1_RewardStreamRequest__Output, _spacemesh_v2alpha1_Reward__Output>
}
