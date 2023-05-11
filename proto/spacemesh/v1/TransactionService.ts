// Original file: proto/tx.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ParseTransactionRequest as _spacemesh_v1_ParseTransactionRequest, ParseTransactionRequest__Output as _spacemesh_v1_ParseTransactionRequest__Output } from '../../spacemesh/v1/ParseTransactionRequest';
import type { ParseTransactionResponse as _spacemesh_v1_ParseTransactionResponse, ParseTransactionResponse__Output as _spacemesh_v1_ParseTransactionResponse__Output } from '../../spacemesh/v1/ParseTransactionResponse';
import type { SubmitTransactionRequest as _spacemesh_v1_SubmitTransactionRequest, SubmitTransactionRequest__Output as _spacemesh_v1_SubmitTransactionRequest__Output } from '../../spacemesh/v1/SubmitTransactionRequest';
import type { SubmitTransactionResponse as _spacemesh_v1_SubmitTransactionResponse, SubmitTransactionResponse__Output as _spacemesh_v1_SubmitTransactionResponse__Output } from '../../spacemesh/v1/SubmitTransactionResponse';
import type { TransactionResult as _spacemesh_v1_TransactionResult, TransactionResult__Output as _spacemesh_v1_TransactionResult__Output } from '../../spacemesh/v1/TransactionResult';
import type { TransactionResultsRequest as _spacemesh_v1_TransactionResultsRequest, TransactionResultsRequest__Output as _spacemesh_v1_TransactionResultsRequest__Output } from '../../spacemesh/v1/TransactionResultsRequest';
import type { TransactionsStateRequest as _spacemesh_v1_TransactionsStateRequest, TransactionsStateRequest__Output as _spacemesh_v1_TransactionsStateRequest__Output } from '../../spacemesh/v1/TransactionsStateRequest';
import type { TransactionsStateResponse as _spacemesh_v1_TransactionsStateResponse, TransactionsStateResponse__Output as _spacemesh_v1_TransactionsStateResponse__Output } from '../../spacemesh/v1/TransactionsStateResponse';
import type { TransactionsStateStreamRequest as _spacemesh_v1_TransactionsStateStreamRequest, TransactionsStateStreamRequest__Output as _spacemesh_v1_TransactionsStateStreamRequest__Output } from '../../spacemesh/v1/TransactionsStateStreamRequest';
import type { TransactionsStateStreamResponse as _spacemesh_v1_TransactionsStateStreamResponse, TransactionsStateStreamResponse__Output as _spacemesh_v1_TransactionsStateStreamResponse__Output } from '../../spacemesh/v1/TransactionsStateStreamResponse';

export interface TransactionServiceClient extends grpc.Client {
  ParseTransaction(argument: _spacemesh_v1_ParseTransactionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ParseTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  ParseTransaction(argument: _spacemesh_v1_ParseTransactionRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ParseTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  ParseTransaction(argument: _spacemesh_v1_ParseTransactionRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ParseTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  ParseTransaction(argument: _spacemesh_v1_ParseTransactionRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ParseTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  parseTransaction(argument: _spacemesh_v1_ParseTransactionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ParseTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  parseTransaction(argument: _spacemesh_v1_ParseTransactionRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ParseTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  parseTransaction(argument: _spacemesh_v1_ParseTransactionRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ParseTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  parseTransaction(argument: _spacemesh_v1_ParseTransactionRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ParseTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  
  StreamResults(argument: _spacemesh_v1_TransactionResultsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_TransactionResult__Output>;
  StreamResults(argument: _spacemesh_v1_TransactionResultsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_TransactionResult__Output>;
  streamResults(argument: _spacemesh_v1_TransactionResultsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_TransactionResult__Output>;
  streamResults(argument: _spacemesh_v1_TransactionResultsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_TransactionResult__Output>;
  
  SubmitTransaction(argument: _spacemesh_v1_SubmitTransactionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SubmitTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  SubmitTransaction(argument: _spacemesh_v1_SubmitTransactionRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SubmitTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  SubmitTransaction(argument: _spacemesh_v1_SubmitTransactionRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SubmitTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  SubmitTransaction(argument: _spacemesh_v1_SubmitTransactionRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SubmitTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  submitTransaction(argument: _spacemesh_v1_SubmitTransactionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SubmitTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  submitTransaction(argument: _spacemesh_v1_SubmitTransactionRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SubmitTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  submitTransaction(argument: _spacemesh_v1_SubmitTransactionRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SubmitTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  submitTransaction(argument: _spacemesh_v1_SubmitTransactionRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SubmitTransactionResponse__Output) => void): grpc.ClientUnaryCall;
  
  TransactionsState(argument: _spacemesh_v1_TransactionsStateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_TransactionsStateResponse__Output) => void): grpc.ClientUnaryCall;
  TransactionsState(argument: _spacemesh_v1_TransactionsStateRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_TransactionsStateResponse__Output) => void): grpc.ClientUnaryCall;
  TransactionsState(argument: _spacemesh_v1_TransactionsStateRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_TransactionsStateResponse__Output) => void): grpc.ClientUnaryCall;
  TransactionsState(argument: _spacemesh_v1_TransactionsStateRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_TransactionsStateResponse__Output) => void): grpc.ClientUnaryCall;
  transactionsState(argument: _spacemesh_v1_TransactionsStateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_TransactionsStateResponse__Output) => void): grpc.ClientUnaryCall;
  transactionsState(argument: _spacemesh_v1_TransactionsStateRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_TransactionsStateResponse__Output) => void): grpc.ClientUnaryCall;
  transactionsState(argument: _spacemesh_v1_TransactionsStateRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_TransactionsStateResponse__Output) => void): grpc.ClientUnaryCall;
  transactionsState(argument: _spacemesh_v1_TransactionsStateRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_TransactionsStateResponse__Output) => void): grpc.ClientUnaryCall;
  
  TransactionsStateStream(argument: _spacemesh_v1_TransactionsStateStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_TransactionsStateStreamResponse__Output>;
  TransactionsStateStream(argument: _spacemesh_v1_TransactionsStateStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_TransactionsStateStreamResponse__Output>;
  transactionsStateStream(argument: _spacemesh_v1_TransactionsStateStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_TransactionsStateStreamResponse__Output>;
  transactionsStateStream(argument: _spacemesh_v1_TransactionsStateStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_TransactionsStateStreamResponse__Output>;
  
}

export interface TransactionServiceHandlers extends grpc.UntypedServiceImplementation {
  ParseTransaction: grpc.handleUnaryCall<_spacemesh_v1_ParseTransactionRequest__Output, _spacemesh_v1_ParseTransactionResponse>;
  
  StreamResults: grpc.handleServerStreamingCall<_spacemesh_v1_TransactionResultsRequest__Output, _spacemesh_v1_TransactionResult>;
  
  SubmitTransaction: grpc.handleUnaryCall<_spacemesh_v1_SubmitTransactionRequest__Output, _spacemesh_v1_SubmitTransactionResponse>;
  
  TransactionsState: grpc.handleUnaryCall<_spacemesh_v1_TransactionsStateRequest__Output, _spacemesh_v1_TransactionsStateResponse>;
  
  TransactionsStateStream: grpc.handleServerStreamingCall<_spacemesh_v1_TransactionsStateStreamRequest__Output, _spacemesh_v1_TransactionsStateStreamResponse>;
  
}

export interface TransactionServiceDefinition extends grpc.ServiceDefinition {
  ParseTransaction: MethodDefinition<_spacemesh_v1_ParseTransactionRequest, _spacemesh_v1_ParseTransactionResponse, _spacemesh_v1_ParseTransactionRequest__Output, _spacemesh_v1_ParseTransactionResponse__Output>
  StreamResults: MethodDefinition<_spacemesh_v1_TransactionResultsRequest, _spacemesh_v1_TransactionResult, _spacemesh_v1_TransactionResultsRequest__Output, _spacemesh_v1_TransactionResult__Output>
  SubmitTransaction: MethodDefinition<_spacemesh_v1_SubmitTransactionRequest, _spacemesh_v1_SubmitTransactionResponse, _spacemesh_v1_SubmitTransactionRequest__Output, _spacemesh_v1_SubmitTransactionResponse__Output>
  TransactionsState: MethodDefinition<_spacemesh_v1_TransactionsStateRequest, _spacemesh_v1_TransactionsStateResponse, _spacemesh_v1_TransactionsStateRequest__Output, _spacemesh_v1_TransactionsStateResponse__Output>
  TransactionsStateStream: MethodDefinition<_spacemesh_v1_TransactionsStateStreamRequest, _spacemesh_v1_TransactionsStateStreamResponse, _spacemesh_v1_TransactionsStateStreamRequest__Output, _spacemesh_v1_TransactionsStateStreamResponse__Output>
}
