// Original file: proto/gateway.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { VerifyChallengeRequest as _spacemesh_v1_VerifyChallengeRequest, VerifyChallengeRequest__Output as _spacemesh_v1_VerifyChallengeRequest__Output } from '../../spacemesh/v1/VerifyChallengeRequest';
import type { VerifyChallengeResponse as _spacemesh_v1_VerifyChallengeResponse, VerifyChallengeResponse__Output as _spacemesh_v1_VerifyChallengeResponse__Output } from '../../spacemesh/v1/VerifyChallengeResponse';

export interface GatewayServiceClient extends grpc.Client {
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
  VerifyChallenge: grpc.handleUnaryCall<_spacemesh_v1_VerifyChallengeRequest__Output, _spacemesh_v1_VerifyChallengeResponse>;
  
}

export interface GatewayServiceDefinition extends grpc.ServiceDefinition {
  VerifyChallenge: MethodDefinition<_spacemesh_v1_VerifyChallengeRequest, _spacemesh_v1_VerifyChallengeResponse, _spacemesh_v1_VerifyChallengeRequest__Output, _spacemesh_v1_VerifyChallengeResponse__Output>
}
