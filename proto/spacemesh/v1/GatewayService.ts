// Original file: proto/gateway.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BroadcastPoetRequest as _spacemesh_v1_BroadcastPoetRequest, BroadcastPoetRequest__Output as _spacemesh_v1_BroadcastPoetRequest__Output } from '../../spacemesh/v1/BroadcastPoetRequest';
import type { BroadcastPoetResponse as _spacemesh_v1_BroadcastPoetResponse, BroadcastPoetResponse__Output as _spacemesh_v1_BroadcastPoetResponse__Output } from '../../spacemesh/v1/BroadcastPoetResponse';
import type { VerifyChallengeRequest as _spacemesh_v1_VerifyChallengeRequest, VerifyChallengeRequest__Output as _spacemesh_v1_VerifyChallengeRequest__Output } from '../../spacemesh/v1/VerifyChallengeRequest';
import type { VerifyChallengeResponse as _spacemesh_v1_VerifyChallengeResponse, VerifyChallengeResponse__Output as _spacemesh_v1_VerifyChallengeResponse__Output } from '../../spacemesh/v1/VerifyChallengeResponse';

export interface GatewayServiceClient extends grpc.Client {
  BroadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  BroadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  BroadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  BroadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  broadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  broadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  broadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  broadcastPoet(argument: _spacemesh_v1_BroadcastPoetRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BroadcastPoetResponse__Output) => void): grpc.ClientUnaryCall;
  
  VerifyChallenge(argument: _spacemesh_v1_VerifyChallengeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VerifyChallengeResponse__Output) => void): grpc.ClientUnaryCall;
  VerifyChallenge(argument: _spacemesh_v1_VerifyChallengeRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VerifyChallengeResponse__Output) => void): grpc.ClientUnaryCall;
  VerifyChallenge(argument: _spacemesh_v1_VerifyChallengeRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VerifyChallengeResponse__Output) => void): grpc.ClientUnaryCall;
  VerifyChallenge(argument: _spacemesh_v1_VerifyChallengeRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VerifyChallengeResponse__Output) => void): grpc.ClientUnaryCall;
  verifyChallenge(argument: _spacemesh_v1_VerifyChallengeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VerifyChallengeResponse__Output) => void): grpc.ClientUnaryCall;
  verifyChallenge(argument: _spacemesh_v1_VerifyChallengeRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VerifyChallengeResponse__Output) => void): grpc.ClientUnaryCall;
  verifyChallenge(argument: _spacemesh_v1_VerifyChallengeRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VerifyChallengeResponse__Output) => void): grpc.ClientUnaryCall;
  verifyChallenge(argument: _spacemesh_v1_VerifyChallengeRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VerifyChallengeResponse__Output) => void): grpc.ClientUnaryCall;
  
}

export interface GatewayServiceHandlers extends grpc.UntypedServiceImplementation {
  BroadcastPoet: grpc.handleUnaryCall<_spacemesh_v1_BroadcastPoetRequest__Output, _spacemesh_v1_BroadcastPoetResponse>;
  
  VerifyChallenge: grpc.handleUnaryCall<_spacemesh_v1_VerifyChallengeRequest__Output, _spacemesh_v1_VerifyChallengeResponse>;
  
}

export interface GatewayServiceDefinition extends grpc.ServiceDefinition {
  BroadcastPoet: MethodDefinition<_spacemesh_v1_BroadcastPoetRequest, _spacemesh_v1_BroadcastPoetResponse, _spacemesh_v1_BroadcastPoetRequest__Output, _spacemesh_v1_BroadcastPoetResponse__Output>
  VerifyChallenge: MethodDefinition<_spacemesh_v1_VerifyChallengeRequest, _spacemesh_v1_VerifyChallengeResponse, _spacemesh_v1_VerifyChallengeRequest__Output, _spacemesh_v1_VerifyChallengeResponse__Output>
}
