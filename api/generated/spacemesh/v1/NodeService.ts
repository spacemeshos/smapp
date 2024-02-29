// Original file: vendor/api/spacemesh/v1/node.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BuildResponse as _spacemesh_v1_BuildResponse, BuildResponse__Output as _spacemesh_v1_BuildResponse__Output } from '../../spacemesh/v1/BuildResponse';
import type { EchoRequest as _spacemesh_v1_EchoRequest, EchoRequest__Output as _spacemesh_v1_EchoRequest__Output } from '../../spacemesh/v1/EchoRequest';
import type { EchoResponse as _spacemesh_v1_EchoResponse, EchoResponse__Output as _spacemesh_v1_EchoResponse__Output } from '../../spacemesh/v1/EchoResponse';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../google/protobuf/Empty';
import type { ErrorStreamRequest as _spacemesh_v1_ErrorStreamRequest, ErrorStreamRequest__Output as _spacemesh_v1_ErrorStreamRequest__Output } from '../../spacemesh/v1/ErrorStreamRequest';
import type { ErrorStreamResponse as _spacemesh_v1_ErrorStreamResponse, ErrorStreamResponse__Output as _spacemesh_v1_ErrorStreamResponse__Output } from '../../spacemesh/v1/ErrorStreamResponse';
import type { NodeInfoResponse as _spacemesh_v1_NodeInfoResponse, NodeInfoResponse__Output as _spacemesh_v1_NodeInfoResponse__Output } from '../../spacemesh/v1/NodeInfoResponse';
import type { StatusRequest as _spacemesh_v1_StatusRequest, StatusRequest__Output as _spacemesh_v1_StatusRequest__Output } from '../../spacemesh/v1/StatusRequest';
import type { StatusResponse as _spacemesh_v1_StatusResponse, StatusResponse__Output as _spacemesh_v1_StatusResponse__Output } from '../../spacemesh/v1/StatusResponse';
import type { StatusStreamRequest as _spacemesh_v1_StatusStreamRequest, StatusStreamRequest__Output as _spacemesh_v1_StatusStreamRequest__Output } from '../../spacemesh/v1/StatusStreamRequest';
import type { StatusStreamResponse as _spacemesh_v1_StatusStreamResponse, StatusStreamResponse__Output as _spacemesh_v1_StatusStreamResponse__Output } from '../../spacemesh/v1/StatusStreamResponse';
import type { VersionResponse as _spacemesh_v1_VersionResponse, VersionResponse__Output as _spacemesh_v1_VersionResponse__Output } from '../../spacemesh/v1/VersionResponse';

export interface NodeServiceClient extends grpc.Client {
  Build(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BuildResponse__Output) => void): grpc.ClientUnaryCall;
  Build(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BuildResponse__Output) => void): grpc.ClientUnaryCall;
  Build(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BuildResponse__Output) => void): grpc.ClientUnaryCall;
  Build(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BuildResponse__Output) => void): grpc.ClientUnaryCall;
  build(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BuildResponse__Output) => void): grpc.ClientUnaryCall;
  build(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BuildResponse__Output) => void): grpc.ClientUnaryCall;
  build(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BuildResponse__Output) => void): grpc.ClientUnaryCall;
  build(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_BuildResponse__Output) => void): grpc.ClientUnaryCall;
  
  Echo(argument: _spacemesh_v1_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  Echo(argument: _spacemesh_v1_EchoRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  Echo(argument: _spacemesh_v1_EchoRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  Echo(argument: _spacemesh_v1_EchoRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  echo(argument: _spacemesh_v1_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  echo(argument: _spacemesh_v1_EchoRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  echo(argument: _spacemesh_v1_EchoRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  echo(argument: _spacemesh_v1_EchoRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  
  ErrorStream(argument: _spacemesh_v1_ErrorStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_ErrorStreamResponse__Output>;
  ErrorStream(argument: _spacemesh_v1_ErrorStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_ErrorStreamResponse__Output>;
  errorStream(argument: _spacemesh_v1_ErrorStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_ErrorStreamResponse__Output>;
  errorStream(argument: _spacemesh_v1_ErrorStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_ErrorStreamResponse__Output>;
  
  NodeInfo(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NodeInfoResponse__Output) => void): grpc.ClientUnaryCall;
  NodeInfo(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NodeInfoResponse__Output) => void): grpc.ClientUnaryCall;
  NodeInfo(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NodeInfoResponse__Output) => void): grpc.ClientUnaryCall;
  NodeInfo(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NodeInfoResponse__Output) => void): grpc.ClientUnaryCall;
  nodeInfo(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NodeInfoResponse__Output) => void): grpc.ClientUnaryCall;
  nodeInfo(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NodeInfoResponse__Output) => void): grpc.ClientUnaryCall;
  nodeInfo(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NodeInfoResponse__Output) => void): grpc.ClientUnaryCall;
  nodeInfo(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_NodeInfoResponse__Output) => void): grpc.ClientUnaryCall;
  
  Status(argument: _spacemesh_v1_StatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StatusResponse__Output) => void): grpc.ClientUnaryCall;
  Status(argument: _spacemesh_v1_StatusRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StatusResponse__Output) => void): grpc.ClientUnaryCall;
  Status(argument: _spacemesh_v1_StatusRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StatusResponse__Output) => void): grpc.ClientUnaryCall;
  Status(argument: _spacemesh_v1_StatusRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StatusResponse__Output) => void): grpc.ClientUnaryCall;
  status(argument: _spacemesh_v1_StatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StatusResponse__Output) => void): grpc.ClientUnaryCall;
  status(argument: _spacemesh_v1_StatusRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StatusResponse__Output) => void): grpc.ClientUnaryCall;
  status(argument: _spacemesh_v1_StatusRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StatusResponse__Output) => void): grpc.ClientUnaryCall;
  status(argument: _spacemesh_v1_StatusRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StatusResponse__Output) => void): grpc.ClientUnaryCall;
  
  StatusStream(argument: _spacemesh_v1_StatusStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_StatusStreamResponse__Output>;
  StatusStream(argument: _spacemesh_v1_StatusStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_StatusStreamResponse__Output>;
  statusStream(argument: _spacemesh_v1_StatusStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_StatusStreamResponse__Output>;
  statusStream(argument: _spacemesh_v1_StatusStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_StatusStreamResponse__Output>;
  
  Version(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VersionResponse__Output) => void): grpc.ClientUnaryCall;
  Version(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VersionResponse__Output) => void): grpc.ClientUnaryCall;
  Version(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VersionResponse__Output) => void): grpc.ClientUnaryCall;
  Version(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VersionResponse__Output) => void): grpc.ClientUnaryCall;
  version(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VersionResponse__Output) => void): grpc.ClientUnaryCall;
  version(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VersionResponse__Output) => void): grpc.ClientUnaryCall;
  version(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VersionResponse__Output) => void): grpc.ClientUnaryCall;
  version(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_VersionResponse__Output) => void): grpc.ClientUnaryCall;
  
}

export interface NodeServiceHandlers extends grpc.UntypedServiceImplementation {
  Build: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _spacemesh_v1_BuildResponse>;
  
  Echo: grpc.handleUnaryCall<_spacemesh_v1_EchoRequest__Output, _spacemesh_v1_EchoResponse>;
  
  ErrorStream: grpc.handleServerStreamingCall<_spacemesh_v1_ErrorStreamRequest__Output, _spacemesh_v1_ErrorStreamResponse>;
  
  NodeInfo: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _spacemesh_v1_NodeInfoResponse>;
  
  Status: grpc.handleUnaryCall<_spacemesh_v1_StatusRequest__Output, _spacemesh_v1_StatusResponse>;
  
  StatusStream: grpc.handleServerStreamingCall<_spacemesh_v1_StatusStreamRequest__Output, _spacemesh_v1_StatusStreamResponse>;
  
  Version: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _spacemesh_v1_VersionResponse>;
  
}

export interface NodeServiceDefinition extends grpc.ServiceDefinition {
  Build: MethodDefinition<_google_protobuf_Empty, _spacemesh_v1_BuildResponse, _google_protobuf_Empty__Output, _spacemesh_v1_BuildResponse__Output>
  Echo: MethodDefinition<_spacemesh_v1_EchoRequest, _spacemesh_v1_EchoResponse, _spacemesh_v1_EchoRequest__Output, _spacemesh_v1_EchoResponse__Output>
  ErrorStream: MethodDefinition<_spacemesh_v1_ErrorStreamRequest, _spacemesh_v1_ErrorStreamResponse, _spacemesh_v1_ErrorStreamRequest__Output, _spacemesh_v1_ErrorStreamResponse__Output>
  NodeInfo: MethodDefinition<_google_protobuf_Empty, _spacemesh_v1_NodeInfoResponse, _google_protobuf_Empty__Output, _spacemesh_v1_NodeInfoResponse__Output>
  Status: MethodDefinition<_spacemesh_v1_StatusRequest, _spacemesh_v1_StatusResponse, _spacemesh_v1_StatusRequest__Output, _spacemesh_v1_StatusResponse__Output>
  StatusStream: MethodDefinition<_spacemesh_v1_StatusStreamRequest, _spacemesh_v1_StatusStreamResponse, _spacemesh_v1_StatusStreamRequest__Output, _spacemesh_v1_StatusStreamResponse__Output>
  Version: MethodDefinition<_google_protobuf_Empty, _spacemesh_v1_VersionResponse, _google_protobuf_Empty__Output, _spacemesh_v1_VersionResponse__Output>
}
