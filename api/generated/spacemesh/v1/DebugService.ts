// Original file: vendor/api/spacemesh/v1/debug.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AccountsRequest as _spacemesh_v1_AccountsRequest, AccountsRequest__Output as _spacemesh_v1_AccountsRequest__Output } from '../../spacemesh/v1/AccountsRequest';
import type { AccountsResponse as _spacemesh_v1_AccountsResponse, AccountsResponse__Output as _spacemesh_v1_AccountsResponse__Output } from '../../spacemesh/v1/AccountsResponse';
import type { ActiveSetRequest as _spacemesh_v1_ActiveSetRequest, ActiveSetRequest__Output as _spacemesh_v1_ActiveSetRequest__Output } from '../../spacemesh/v1/ActiveSetRequest';
import type { ActiveSetResponse as _spacemesh_v1_ActiveSetResponse, ActiveSetResponse__Output as _spacemesh_v1_ActiveSetResponse__Output } from '../../spacemesh/v1/ActiveSetResponse';
import type { ChangeLogLevelRequest as _spacemesh_v1_ChangeLogLevelRequest, ChangeLogLevelRequest__Output as _spacemesh_v1_ChangeLogLevelRequest__Output } from '../../spacemesh/v1/ChangeLogLevelRequest';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../google/protobuf/Empty';
import type { NetworkInfoResponse as _spacemesh_v1_NetworkInfoResponse, NetworkInfoResponse__Output as _spacemesh_v1_NetworkInfoResponse__Output } from '../../spacemesh/v1/NetworkInfoResponse';
import type { Proposal as _spacemesh_v1_Proposal, Proposal__Output as _spacemesh_v1_Proposal__Output } from '../../spacemesh/v1/Proposal';

export interface DebugServiceClient extends grpc.Client {
  Accounts(argument: _spacemesh_v1_AccountsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountsResponse__Output) => void): grpc.ClientUnaryCall;
  Accounts(argument: _spacemesh_v1_AccountsRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountsResponse__Output) => void): grpc.ClientUnaryCall;
  Accounts(argument: _spacemesh_v1_AccountsRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountsResponse__Output) => void): grpc.ClientUnaryCall;
  Accounts(argument: _spacemesh_v1_AccountsRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountsResponse__Output) => void): grpc.ClientUnaryCall;
  accounts(argument: _spacemesh_v1_AccountsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountsResponse__Output) => void): grpc.ClientUnaryCall;
  accounts(argument: _spacemesh_v1_AccountsRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountsResponse__Output) => void): grpc.ClientUnaryCall;
  accounts(argument: _spacemesh_v1_AccountsRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountsResponse__Output) => void): grpc.ClientUnaryCall;
  accounts(argument: _spacemesh_v1_AccountsRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountsResponse__Output) => void): grpc.ClientUnaryCall;
  
  ActiveSet(argument: _spacemesh_v1_ActiveSetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ActiveSetResponse__Output) => void): grpc.ClientUnaryCall;
  ActiveSet(argument: _spacemesh_v1_ActiveSetRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ActiveSetResponse__Output) => void): grpc.ClientUnaryCall;
  ActiveSet(argument: _spacemesh_v1_ActiveSetRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ActiveSetResponse__Output) => void): grpc.ClientUnaryCall;
  ActiveSet(argument: _spacemesh_v1_ActiveSetRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ActiveSetResponse__Output) => void): grpc.ClientUnaryCall;
  activeSet(argument: _spacemesh_v1_ActiveSetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ActiveSetResponse__Output) => void): grpc.ClientUnaryCall;
  activeSet(argument: _spacemesh_v1_ActiveSetRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ActiveSetResponse__Output) => void): grpc.ClientUnaryCall;
  activeSet(argument: _spacemesh_v1_ActiveSetRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ActiveSetResponse__Output) => void): grpc.ClientUnaryCall;
  activeSet(argument: _spacemesh_v1_ActiveSetRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ActiveSetResponse__Output) => void): grpc.ClientUnaryCall;
  
  ChangeLogLevel(argument: _spacemesh_v1_ChangeLogLevelRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  ChangeLogLevel(argument: _spacemesh_v1_ChangeLogLevelRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  ChangeLogLevel(argument: _spacemesh_v1_ChangeLogLevelRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  ChangeLogLevel(argument: _spacemesh_v1_ChangeLogLevelRequest, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  changeLogLevel(argument: _spacemesh_v1_ChangeLogLevelRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  changeLogLevel(argument: _spacemesh_v1_ChangeLogLevelRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  changeLogLevel(argument: _spacemesh_v1_ChangeLogLevelRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  changeLogLevel(argument: _spacemesh_v1_ChangeLogLevelRequest, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  
  NetworkInfo(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NetworkInfoResponse__Output) => void): grpc.ClientUnaryCall;
  NetworkInfo(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NetworkInfoResponse__Output) => void): grpc.ClientUnaryCall;
  NetworkInfo(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NetworkInfoResponse__Output) => void): grpc.ClientUnaryCall;
  NetworkInfo(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NetworkInfoResponse__Output) => void): grpc.ClientUnaryCall;
  networkInfo(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NetworkInfoResponse__Output) => void): grpc.ClientUnaryCall;
  networkInfo(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NetworkInfoResponse__Output) => void): grpc.ClientUnaryCall;
  networkInfo(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NetworkInfoResponse__Output) => void): grpc.ClientUnaryCall;
  networkInfo(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NetworkInfoResponse__Output) => void): grpc.ClientUnaryCall;
  
  ProposalsStream(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_Proposal__Output>;
  ProposalsStream(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_Proposal__Output>;
  proposalsStream(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_Proposal__Output>;
  proposalsStream(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_Proposal__Output>;
  
}

export interface DebugServiceHandlers extends grpc.UntypedServiceImplementation {
  Accounts: grpc.handleUnaryCall<_spacemesh_v1_AccountsRequest__Output, _spacemesh_v1_AccountsResponse>;
  
  ActiveSet: grpc.handleUnaryCall<_spacemesh_v1_ActiveSetRequest__Output, _spacemesh_v1_ActiveSetResponse>;
  
  ChangeLogLevel: grpc.handleUnaryCall<_spacemesh_v1_ChangeLogLevelRequest__Output, _google_protobuf_Empty>;
  
  NetworkInfo: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _spacemesh_v1_NetworkInfoResponse>;
  
  ProposalsStream: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _spacemesh_v1_Proposal>;
  
}

export interface DebugServiceDefinition extends grpc.ServiceDefinition {
  Accounts: MethodDefinition<_spacemesh_v1_AccountsRequest, _spacemesh_v1_AccountsResponse, _spacemesh_v1_AccountsRequest__Output, _spacemesh_v1_AccountsResponse__Output>
  ActiveSet: MethodDefinition<_spacemesh_v1_ActiveSetRequest, _spacemesh_v1_ActiveSetResponse, _spacemesh_v1_ActiveSetRequest__Output, _spacemesh_v1_ActiveSetResponse__Output>
  ChangeLogLevel: MethodDefinition<_spacemesh_v1_ChangeLogLevelRequest, _google_protobuf_Empty, _spacemesh_v1_ChangeLogLevelRequest__Output, _google_protobuf_Empty__Output>
  NetworkInfo: MethodDefinition<_google_protobuf_Empty, _spacemesh_v1_NetworkInfoResponse, _google_protobuf_Empty__Output, _spacemesh_v1_NetworkInfoResponse__Output>
  ProposalsStream: MethodDefinition<_google_protobuf_Empty, _spacemesh_v1_Proposal, _google_protobuf_Empty__Output, _spacemesh_v1_Proposal__Output>
}
