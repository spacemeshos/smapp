// Original file: vendor/api/spacemesh/v2alpha1/reward.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { RewardList as _spacemesh_v2alpha1_RewardList, RewardList__Output as _spacemesh_v2alpha1_RewardList__Output } from '../../spacemesh/v2alpha1/RewardList';
import type { RewardRequest as _spacemesh_v2alpha1_RewardRequest, RewardRequest__Output as _spacemesh_v2alpha1_RewardRequest__Output } from '../../spacemesh/v2alpha1/RewardRequest';

export interface RewardServiceClient extends grpc.Client {
  List(argument: _spacemesh_v2alpha1_RewardRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_RewardList__Output) => void): grpc.ClientUnaryCall;
  List(argument: _spacemesh_v2alpha1_RewardRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_RewardList__Output) => void): grpc.ClientUnaryCall;
  List(argument: _spacemesh_v2alpha1_RewardRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_RewardList__Output) => void): grpc.ClientUnaryCall;
  List(argument: _spacemesh_v2alpha1_RewardRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_RewardList__Output) => void): grpc.ClientUnaryCall;
  list(argument: _spacemesh_v2alpha1_RewardRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_RewardList__Output) => void): grpc.ClientUnaryCall;
  list(argument: _spacemesh_v2alpha1_RewardRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_RewardList__Output) => void): grpc.ClientUnaryCall;
  list(argument: _spacemesh_v2alpha1_RewardRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_RewardList__Output) => void): grpc.ClientUnaryCall;
  list(argument: _spacemesh_v2alpha1_RewardRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v2alpha1_RewardList__Output) => void): grpc.ClientUnaryCall;
  
}

export interface RewardServiceHandlers extends grpc.UntypedServiceImplementation {
  List: grpc.handleUnaryCall<_spacemesh_v2alpha1_RewardRequest__Output, _spacemesh_v2alpha1_RewardList>;
  
}

export interface RewardServiceDefinition extends grpc.ServiceDefinition {
  List: MethodDefinition<_spacemesh_v2alpha1_RewardRequest, _spacemesh_v2alpha1_RewardList, _spacemesh_v2alpha1_RewardRequest__Output, _spacemesh_v2alpha1_RewardList__Output>
}
