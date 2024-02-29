// Original file: vendor/api/spacemesh/v1/global_state.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AccountDataQueryRequest as _spacemesh_v1_AccountDataQueryRequest, AccountDataQueryRequest__Output as _spacemesh_v1_AccountDataQueryRequest__Output } from '../../spacemesh/v1/AccountDataQueryRequest';
import type { AccountDataQueryResponse as _spacemesh_v1_AccountDataQueryResponse, AccountDataQueryResponse__Output as _spacemesh_v1_AccountDataQueryResponse__Output } from '../../spacemesh/v1/AccountDataQueryResponse';
import type { AccountDataStreamRequest as _spacemesh_v1_AccountDataStreamRequest, AccountDataStreamRequest__Output as _spacemesh_v1_AccountDataStreamRequest__Output } from '../../spacemesh/v1/AccountDataStreamRequest';
import type { AccountDataStreamResponse as _spacemesh_v1_AccountDataStreamResponse, AccountDataStreamResponse__Output as _spacemesh_v1_AccountDataStreamResponse__Output } from '../../spacemesh/v1/AccountDataStreamResponse';
import type { AccountRequest as _spacemesh_v1_AccountRequest, AccountRequest__Output as _spacemesh_v1_AccountRequest__Output } from '../../spacemesh/v1/AccountRequest';
import type { AccountResponse as _spacemesh_v1_AccountResponse, AccountResponse__Output as _spacemesh_v1_AccountResponse__Output } from '../../spacemesh/v1/AccountResponse';
import type { AppEventStreamRequest as _spacemesh_v1_AppEventStreamRequest, AppEventStreamRequest__Output as _spacemesh_v1_AppEventStreamRequest__Output } from '../../spacemesh/v1/AppEventStreamRequest';
import type { AppEventStreamResponse as _spacemesh_v1_AppEventStreamResponse, AppEventStreamResponse__Output as _spacemesh_v1_AppEventStreamResponse__Output } from '../../spacemesh/v1/AppEventStreamResponse';
import type { GlobalStateHashRequest as _spacemesh_v1_GlobalStateHashRequest, GlobalStateHashRequest__Output as _spacemesh_v1_GlobalStateHashRequest__Output } from '../../spacemesh/v1/GlobalStateHashRequest';
import type { GlobalStateHashResponse as _spacemesh_v1_GlobalStateHashResponse, GlobalStateHashResponse__Output as _spacemesh_v1_GlobalStateHashResponse__Output } from '../../spacemesh/v1/GlobalStateHashResponse';
import type { GlobalStateStreamRequest as _spacemesh_v1_GlobalStateStreamRequest, GlobalStateStreamRequest__Output as _spacemesh_v1_GlobalStateStreamRequest__Output } from '../../spacemesh/v1/GlobalStateStreamRequest';
import type { GlobalStateStreamResponse as _spacemesh_v1_GlobalStateStreamResponse, GlobalStateStreamResponse__Output as _spacemesh_v1_GlobalStateStreamResponse__Output } from '../../spacemesh/v1/GlobalStateStreamResponse';
import type { SmesherDataQueryRequest as _spacemesh_v1_SmesherDataQueryRequest, SmesherDataQueryRequest__Output as _spacemesh_v1_SmesherDataQueryRequest__Output } from '../../spacemesh/v1/SmesherDataQueryRequest';
import type { SmesherDataQueryResponse as _spacemesh_v1_SmesherDataQueryResponse, SmesherDataQueryResponse__Output as _spacemesh_v1_SmesherDataQueryResponse__Output } from '../../spacemesh/v1/SmesherDataQueryResponse';
import type { SmesherRewardStreamRequest as _spacemesh_v1_SmesherRewardStreamRequest, SmesherRewardStreamRequest__Output as _spacemesh_v1_SmesherRewardStreamRequest__Output } from '../../spacemesh/v1/SmesherRewardStreamRequest';
import type { SmesherRewardStreamResponse as _spacemesh_v1_SmesherRewardStreamResponse, SmesherRewardStreamResponse__Output as _spacemesh_v1_SmesherRewardStreamResponse__Output } from '../../spacemesh/v1/SmesherRewardStreamResponse';

export interface GlobalStateServiceClient extends grpc.Client {
  Account(argument: _spacemesh_v1_AccountRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountResponse__Output) => void): grpc.ClientUnaryCall;
  Account(argument: _spacemesh_v1_AccountRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountResponse__Output) => void): grpc.ClientUnaryCall;
  Account(argument: _spacemesh_v1_AccountRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountResponse__Output) => void): grpc.ClientUnaryCall;
  Account(argument: _spacemesh_v1_AccountRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountResponse__Output) => void): grpc.ClientUnaryCall;
  account(argument: _spacemesh_v1_AccountRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountResponse__Output) => void): grpc.ClientUnaryCall;
  account(argument: _spacemesh_v1_AccountRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountResponse__Output) => void): grpc.ClientUnaryCall;
  account(argument: _spacemesh_v1_AccountRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountResponse__Output) => void): grpc.ClientUnaryCall;
  account(argument: _spacemesh_v1_AccountRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountResponse__Output) => void): grpc.ClientUnaryCall;
  
  AccountDataQuery(argument: _spacemesh_v1_AccountDataQueryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  AccountDataQuery(argument: _spacemesh_v1_AccountDataQueryRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  AccountDataQuery(argument: _spacemesh_v1_AccountDataQueryRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  AccountDataQuery(argument: _spacemesh_v1_AccountDataQueryRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  accountDataQuery(argument: _spacemesh_v1_AccountDataQueryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  accountDataQuery(argument: _spacemesh_v1_AccountDataQueryRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  accountDataQuery(argument: _spacemesh_v1_AccountDataQueryRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  accountDataQuery(argument: _spacemesh_v1_AccountDataQueryRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  
  AccountDataStream(argument: _spacemesh_v1_AccountDataStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_AccountDataStreamResponse__Output>;
  AccountDataStream(argument: _spacemesh_v1_AccountDataStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_AccountDataStreamResponse__Output>;
  accountDataStream(argument: _spacemesh_v1_AccountDataStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_AccountDataStreamResponse__Output>;
  accountDataStream(argument: _spacemesh_v1_AccountDataStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_AccountDataStreamResponse__Output>;
  
  AppEventStream(argument: _spacemesh_v1_AppEventStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_AppEventStreamResponse__Output>;
  AppEventStream(argument: _spacemesh_v1_AppEventStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_AppEventStreamResponse__Output>;
  appEventStream(argument: _spacemesh_v1_AppEventStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_AppEventStreamResponse__Output>;
  appEventStream(argument: _spacemesh_v1_AppEventStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_AppEventStreamResponse__Output>;
  
  GlobalStateHash(argument: _spacemesh_v1_GlobalStateHashRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GlobalStateHashResponse__Output) => void): grpc.ClientUnaryCall;
  GlobalStateHash(argument: _spacemesh_v1_GlobalStateHashRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GlobalStateHashResponse__Output) => void): grpc.ClientUnaryCall;
  GlobalStateHash(argument: _spacemesh_v1_GlobalStateHashRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GlobalStateHashResponse__Output) => void): grpc.ClientUnaryCall;
  GlobalStateHash(argument: _spacemesh_v1_GlobalStateHashRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GlobalStateHashResponse__Output) => void): grpc.ClientUnaryCall;
  globalStateHash(argument: _spacemesh_v1_GlobalStateHashRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GlobalStateHashResponse__Output) => void): grpc.ClientUnaryCall;
  globalStateHash(argument: _spacemesh_v1_GlobalStateHashRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GlobalStateHashResponse__Output) => void): grpc.ClientUnaryCall;
  globalStateHash(argument: _spacemesh_v1_GlobalStateHashRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GlobalStateHashResponse__Output) => void): grpc.ClientUnaryCall;
  globalStateHash(argument: _spacemesh_v1_GlobalStateHashRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GlobalStateHashResponse__Output) => void): grpc.ClientUnaryCall;
  
  GlobalStateStream(argument: _spacemesh_v1_GlobalStateStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_GlobalStateStreamResponse__Output>;
  GlobalStateStream(argument: _spacemesh_v1_GlobalStateStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_GlobalStateStreamResponse__Output>;
  globalStateStream(argument: _spacemesh_v1_GlobalStateStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_GlobalStateStreamResponse__Output>;
  globalStateStream(argument: _spacemesh_v1_GlobalStateStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_GlobalStateStreamResponse__Output>;
  
  SmesherDataQuery(argument: _spacemesh_v1_SmesherDataQueryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  SmesherDataQuery(argument: _spacemesh_v1_SmesherDataQueryRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  SmesherDataQuery(argument: _spacemesh_v1_SmesherDataQueryRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  SmesherDataQuery(argument: _spacemesh_v1_SmesherDataQueryRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  smesherDataQuery(argument: _spacemesh_v1_SmesherDataQueryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  smesherDataQuery(argument: _spacemesh_v1_SmesherDataQueryRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  smesherDataQuery(argument: _spacemesh_v1_SmesherDataQueryRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  smesherDataQuery(argument: _spacemesh_v1_SmesherDataQueryRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  
  SmesherRewardStream(argument: _spacemesh_v1_SmesherRewardStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_SmesherRewardStreamResponse__Output>;
  SmesherRewardStream(argument: _spacemesh_v1_SmesherRewardStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_SmesherRewardStreamResponse__Output>;
  smesherRewardStream(argument: _spacemesh_v1_SmesherRewardStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_SmesherRewardStreamResponse__Output>;
  smesherRewardStream(argument: _spacemesh_v1_SmesherRewardStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_SmesherRewardStreamResponse__Output>;
  
}

export interface GlobalStateServiceHandlers extends grpc.UntypedServiceImplementation {
  Account: grpc.handleUnaryCall<_spacemesh_v1_AccountRequest__Output, _spacemesh_v1_AccountResponse>;
  
  AccountDataQuery: grpc.handleUnaryCall<_spacemesh_v1_AccountDataQueryRequest__Output, _spacemesh_v1_AccountDataQueryResponse>;
  
  AccountDataStream: grpc.handleServerStreamingCall<_spacemesh_v1_AccountDataStreamRequest__Output, _spacemesh_v1_AccountDataStreamResponse>;
  
  AppEventStream: grpc.handleServerStreamingCall<_spacemesh_v1_AppEventStreamRequest__Output, _spacemesh_v1_AppEventStreamResponse>;
  
  GlobalStateHash: grpc.handleUnaryCall<_spacemesh_v1_GlobalStateHashRequest__Output, _spacemesh_v1_GlobalStateHashResponse>;
  
  GlobalStateStream: grpc.handleServerStreamingCall<_spacemesh_v1_GlobalStateStreamRequest__Output, _spacemesh_v1_GlobalStateStreamResponse>;
  
  SmesherDataQuery: grpc.handleUnaryCall<_spacemesh_v1_SmesherDataQueryRequest__Output, _spacemesh_v1_SmesherDataQueryResponse>;
  
  SmesherRewardStream: grpc.handleServerStreamingCall<_spacemesh_v1_SmesherRewardStreamRequest__Output, _spacemesh_v1_SmesherRewardStreamResponse>;
  
}

export interface GlobalStateServiceDefinition extends grpc.ServiceDefinition {
  Account: MethodDefinition<_spacemesh_v1_AccountRequest, _spacemesh_v1_AccountResponse, _spacemesh_v1_AccountRequest__Output, _spacemesh_v1_AccountResponse__Output>
  AccountDataQuery: MethodDefinition<_spacemesh_v1_AccountDataQueryRequest, _spacemesh_v1_AccountDataQueryResponse, _spacemesh_v1_AccountDataQueryRequest__Output, _spacemesh_v1_AccountDataQueryResponse__Output>
  AccountDataStream: MethodDefinition<_spacemesh_v1_AccountDataStreamRequest, _spacemesh_v1_AccountDataStreamResponse, _spacemesh_v1_AccountDataStreamRequest__Output, _spacemesh_v1_AccountDataStreamResponse__Output>
  AppEventStream: MethodDefinition<_spacemesh_v1_AppEventStreamRequest, _spacemesh_v1_AppEventStreamResponse, _spacemesh_v1_AppEventStreamRequest__Output, _spacemesh_v1_AppEventStreamResponse__Output>
  GlobalStateHash: MethodDefinition<_spacemesh_v1_GlobalStateHashRequest, _spacemesh_v1_GlobalStateHashResponse, _spacemesh_v1_GlobalStateHashRequest__Output, _spacemesh_v1_GlobalStateHashResponse__Output>
  GlobalStateStream: MethodDefinition<_spacemesh_v1_GlobalStateStreamRequest, _spacemesh_v1_GlobalStateStreamResponse, _spacemesh_v1_GlobalStateStreamRequest__Output, _spacemesh_v1_GlobalStateStreamResponse__Output>
  SmesherDataQuery: MethodDefinition<_spacemesh_v1_SmesherDataQueryRequest, _spacemesh_v1_SmesherDataQueryResponse, _spacemesh_v1_SmesherDataQueryRequest__Output, _spacemesh_v1_SmesherDataQueryResponse__Output>
  SmesherRewardStream: MethodDefinition<_spacemesh_v1_SmesherRewardStreamRequest, _spacemesh_v1_SmesherRewardStreamResponse, _spacemesh_v1_SmesherRewardStreamRequest__Output, _spacemesh_v1_SmesherRewardStreamResponse__Output>
}
