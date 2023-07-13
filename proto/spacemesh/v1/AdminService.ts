// Original file: proto/admin.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CheckpointStreamRequest as _spacemesh_v1_CheckpointStreamRequest, CheckpointStreamRequest__Output as _spacemesh_v1_CheckpointStreamRequest__Output } from '../../spacemesh/v1/CheckpointStreamRequest';
import type { CheckpointStreamResponse as _spacemesh_v1_CheckpointStreamResponse, CheckpointStreamResponse__Output as _spacemesh_v1_CheckpointStreamResponse__Output } from '../../spacemesh/v1/CheckpointStreamResponse';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../google/protobuf/Empty';
import type { Event as _spacemesh_v1_Event, Event__Output as _spacemesh_v1_Event__Output } from '../../spacemesh/v1/Event';
import type { EventStreamRequest as _spacemesh_v1_EventStreamRequest, EventStreamRequest__Output as _spacemesh_v1_EventStreamRequest__Output } from '../../spacemesh/v1/EventStreamRequest';
import type { RecoverRequest as _spacemesh_v1_RecoverRequest, RecoverRequest__Output as _spacemesh_v1_RecoverRequest__Output } from '../../spacemesh/v1/RecoverRequest';

export interface AdminServiceClient extends grpc.Client {
  CheckpointStream(argument: _spacemesh_v1_CheckpointStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_CheckpointStreamResponse__Output>;
  CheckpointStream(argument: _spacemesh_v1_CheckpointStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_CheckpointStreamResponse__Output>;
  checkpointStream(argument: _spacemesh_v1_CheckpointStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_CheckpointStreamResponse__Output>;
  checkpointStream(argument: _spacemesh_v1_CheckpointStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_CheckpointStreamResponse__Output>;
  
  EventsStream(argument: _spacemesh_v1_EventStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_Event__Output>;
  EventsStream(argument: _spacemesh_v1_EventStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_Event__Output>;
  eventsStream(argument: _spacemesh_v1_EventStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_Event__Output>;
  eventsStream(argument: _spacemesh_v1_EventStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_Event__Output>;
  
  Recover(argument: _spacemesh_v1_RecoverRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  Recover(argument: _spacemesh_v1_RecoverRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  Recover(argument: _spacemesh_v1_RecoverRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  Recover(argument: _spacemesh_v1_RecoverRequest, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  recover(argument: _spacemesh_v1_RecoverRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  recover(argument: _spacemesh_v1_RecoverRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  recover(argument: _spacemesh_v1_RecoverRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  recover(argument: _spacemesh_v1_RecoverRequest, callback: (error?: grpc.ServiceError, result?: _google_protobuf_Empty__Output) => void): grpc.ClientUnaryCall;
  
}

export interface AdminServiceHandlers extends grpc.UntypedServiceImplementation {
  CheckpointStream: grpc.handleServerStreamingCall<_spacemesh_v1_CheckpointStreamRequest__Output, _spacemesh_v1_CheckpointStreamResponse>;
  
  EventsStream: grpc.handleServerStreamingCall<_spacemesh_v1_EventStreamRequest__Output, _spacemesh_v1_Event>;
  
  Recover: grpc.handleUnaryCall<_spacemesh_v1_RecoverRequest__Output, _google_protobuf_Empty>;
  
}

export interface AdminServiceDefinition extends grpc.ServiceDefinition {
  CheckpointStream: MethodDefinition<_spacemesh_v1_CheckpointStreamRequest, _spacemesh_v1_CheckpointStreamResponse, _spacemesh_v1_CheckpointStreamRequest__Output, _spacemesh_v1_CheckpointStreamResponse__Output>
  EventsStream: MethodDefinition<_spacemesh_v1_EventStreamRequest, _spacemesh_v1_Event, _spacemesh_v1_EventStreamRequest__Output, _spacemesh_v1_Event__Output>
  Recover: MethodDefinition<_spacemesh_v1_RecoverRequest, _google_protobuf_Empty, _spacemesh_v1_RecoverRequest__Output, _google_protobuf_Empty__Output>
}
