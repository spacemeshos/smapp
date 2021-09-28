// Original file: proto/smesher.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CoinbaseResponse as _spacemesh_v1_CoinbaseResponse, CoinbaseResponse__Output as _spacemesh_v1_CoinbaseResponse__Output } from '../../spacemesh/v1/CoinbaseResponse';
import type { ConfigResponse as _spacemesh_v1_ConfigResponse, ConfigResponse__Output as _spacemesh_v1_ConfigResponse__Output } from '../../spacemesh/v1/ConfigResponse';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../google/protobuf/Empty';
import type { EstimatedRewardsRequest as _spacemesh_v1_EstimatedRewardsRequest, EstimatedRewardsRequest__Output as _spacemesh_v1_EstimatedRewardsRequest__Output } from '../../spacemesh/v1/EstimatedRewardsRequest';
import type { EstimatedRewardsResponse as _spacemesh_v1_EstimatedRewardsResponse, EstimatedRewardsResponse__Output as _spacemesh_v1_EstimatedRewardsResponse__Output } from '../../spacemesh/v1/EstimatedRewardsResponse';
import type { IsSmeshingResponse as _spacemesh_v1_IsSmeshingResponse, IsSmeshingResponse__Output as _spacemesh_v1_IsSmeshingResponse__Output } from '../../spacemesh/v1/IsSmeshingResponse';
import type { MinGasResponse as _spacemesh_v1_MinGasResponse, MinGasResponse__Output as _spacemesh_v1_MinGasResponse__Output } from '../../spacemesh/v1/MinGasResponse';
import type { PostComputeProvidersRequest as _spacemesh_v1_PostComputeProvidersRequest, PostComputeProvidersRequest__Output as _spacemesh_v1_PostComputeProvidersRequest__Output } from '../../spacemesh/v1/PostComputeProvidersRequest';
import type { PostComputeProvidersResponse as _spacemesh_v1_PostComputeProvidersResponse, PostComputeProvidersResponse__Output as _spacemesh_v1_PostComputeProvidersResponse__Output } from '../../spacemesh/v1/PostComputeProvidersResponse';
import type { PostDataCreationProgressStreamResponse as _spacemesh_v1_PostDataCreationProgressStreamResponse, PostDataCreationProgressStreamResponse__Output as _spacemesh_v1_PostDataCreationProgressStreamResponse__Output } from '../../spacemesh/v1/PostDataCreationProgressStreamResponse';
import type { PostStatusResponse as _spacemesh_v1_PostStatusResponse, PostStatusResponse__Output as _spacemesh_v1_PostStatusResponse__Output } from '../../spacemesh/v1/PostStatusResponse';
import type { SetCoinbaseRequest as _spacemesh_v1_SetCoinbaseRequest, SetCoinbaseRequest__Output as _spacemesh_v1_SetCoinbaseRequest__Output } from '../../spacemesh/v1/SetCoinbaseRequest';
import type { SetCoinbaseResponse as _spacemesh_v1_SetCoinbaseResponse, SetCoinbaseResponse__Output as _spacemesh_v1_SetCoinbaseResponse__Output } from '../../spacemesh/v1/SetCoinbaseResponse';
import type { SetMinGasRequest as _spacemesh_v1_SetMinGasRequest, SetMinGasRequest__Output as _spacemesh_v1_SetMinGasRequest__Output } from '../../spacemesh/v1/SetMinGasRequest';
import type { SetMinGasResponse as _spacemesh_v1_SetMinGasResponse, SetMinGasResponse__Output as _spacemesh_v1_SetMinGasResponse__Output } from '../../spacemesh/v1/SetMinGasResponse';
import type { SmesherIDResponse as _spacemesh_v1_SmesherIDResponse, SmesherIDResponse__Output as _spacemesh_v1_SmesherIDResponse__Output } from '../../spacemesh/v1/SmesherIDResponse';
import type { StartSmeshingRequest as _spacemesh_v1_StartSmeshingRequest, StartSmeshingRequest__Output as _spacemesh_v1_StartSmeshingRequest__Output } from '../../spacemesh/v1/StartSmeshingRequest';
import type { StartSmeshingResponse as _spacemesh_v1_StartSmeshingResponse, StartSmeshingResponse__Output as _spacemesh_v1_StartSmeshingResponse__Output } from '../../spacemesh/v1/StartSmeshingResponse';
import type { StopSmeshingRequest as _spacemesh_v1_StopSmeshingRequest, StopSmeshingRequest__Output as _spacemesh_v1_StopSmeshingRequest__Output } from '../../spacemesh/v1/StopSmeshingRequest';
import type { StopSmeshingResponse as _spacemesh_v1_StopSmeshingResponse, StopSmeshingResponse__Output as _spacemesh_v1_StopSmeshingResponse__Output } from '../../spacemesh/v1/StopSmeshingResponse';

export interface SmesherServiceClient extends grpc.Client {
  Coinbase(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  Coinbase(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  Coinbase(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  Coinbase(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  coinbase(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  coinbase(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  coinbase(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  coinbase(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  
  Config(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ConfigResponse__Output) => void): grpc.ClientUnaryCall;
  Config(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ConfigResponse__Output) => void): grpc.ClientUnaryCall;
  Config(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ConfigResponse__Output) => void): grpc.ClientUnaryCall;
  Config(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ConfigResponse__Output) => void): grpc.ClientUnaryCall;
  config(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ConfigResponse__Output) => void): grpc.ClientUnaryCall;
  config(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ConfigResponse__Output) => void): grpc.ClientUnaryCall;
  config(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ConfigResponse__Output) => void): grpc.ClientUnaryCall;
  config(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_ConfigResponse__Output) => void): grpc.ClientUnaryCall;
  
  EstimatedRewards(argument: _spacemesh_v1_EstimatedRewardsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EstimatedRewardsResponse__Output) => void): grpc.ClientUnaryCall;
  EstimatedRewards(argument: _spacemesh_v1_EstimatedRewardsRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EstimatedRewardsResponse__Output) => void): grpc.ClientUnaryCall;
  EstimatedRewards(argument: _spacemesh_v1_EstimatedRewardsRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EstimatedRewardsResponse__Output) => void): grpc.ClientUnaryCall;
  EstimatedRewards(argument: _spacemesh_v1_EstimatedRewardsRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EstimatedRewardsResponse__Output) => void): grpc.ClientUnaryCall;
  estimatedRewards(argument: _spacemesh_v1_EstimatedRewardsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EstimatedRewardsResponse__Output) => void): grpc.ClientUnaryCall;
  estimatedRewards(argument: _spacemesh_v1_EstimatedRewardsRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EstimatedRewardsResponse__Output) => void): grpc.ClientUnaryCall;
  estimatedRewards(argument: _spacemesh_v1_EstimatedRewardsRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EstimatedRewardsResponse__Output) => void): grpc.ClientUnaryCall;
  estimatedRewards(argument: _spacemesh_v1_EstimatedRewardsRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EstimatedRewardsResponse__Output) => void): grpc.ClientUnaryCall;
  
  IsSmeshing(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_IsSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  IsSmeshing(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_IsSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  IsSmeshing(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_IsSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  IsSmeshing(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_IsSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  isSmeshing(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_IsSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  isSmeshing(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_IsSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  isSmeshing(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_IsSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  isSmeshing(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_IsSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  
  MinGas(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MinGasResponse__Output) => void): grpc.ClientUnaryCall;
  MinGas(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MinGasResponse__Output) => void): grpc.ClientUnaryCall;
  MinGas(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MinGasResponse__Output) => void): grpc.ClientUnaryCall;
  MinGas(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MinGasResponse__Output) => void): grpc.ClientUnaryCall;
  minGas(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MinGasResponse__Output) => void): grpc.ClientUnaryCall;
  minGas(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MinGasResponse__Output) => void): grpc.ClientUnaryCall;
  minGas(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MinGasResponse__Output) => void): grpc.ClientUnaryCall;
  minGas(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MinGasResponse__Output) => void): grpc.ClientUnaryCall;
  
  PostComputeProviders(argument: _spacemesh_v1_PostComputeProvidersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostComputeProvidersResponse__Output) => void): grpc.ClientUnaryCall;
  PostComputeProviders(argument: _spacemesh_v1_PostComputeProvidersRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostComputeProvidersResponse__Output) => void): grpc.ClientUnaryCall;
  PostComputeProviders(argument: _spacemesh_v1_PostComputeProvidersRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostComputeProvidersResponse__Output) => void): grpc.ClientUnaryCall;
  PostComputeProviders(argument: _spacemesh_v1_PostComputeProvidersRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostComputeProvidersResponse__Output) => void): grpc.ClientUnaryCall;
  postComputeProviders(argument: _spacemesh_v1_PostComputeProvidersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostComputeProvidersResponse__Output) => void): grpc.ClientUnaryCall;
  postComputeProviders(argument: _spacemesh_v1_PostComputeProvidersRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostComputeProvidersResponse__Output) => void): grpc.ClientUnaryCall;
  postComputeProviders(argument: _spacemesh_v1_PostComputeProvidersRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostComputeProvidersResponse__Output) => void): grpc.ClientUnaryCall;
  postComputeProviders(argument: _spacemesh_v1_PostComputeProvidersRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostComputeProvidersResponse__Output) => void): grpc.ClientUnaryCall;
  
  PostDataCreationProgressStream(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_PostDataCreationProgressStreamResponse__Output>;
  PostDataCreationProgressStream(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_PostDataCreationProgressStreamResponse__Output>;
  postDataCreationProgressStream(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_PostDataCreationProgressStreamResponse__Output>;
  postDataCreationProgressStream(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_PostDataCreationProgressStreamResponse__Output>;
  
  PostStatus(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatusResponse__Output) => void): grpc.ClientUnaryCall;
  PostStatus(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatusResponse__Output) => void): grpc.ClientUnaryCall;
  PostStatus(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatusResponse__Output) => void): grpc.ClientUnaryCall;
  PostStatus(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatusResponse__Output) => void): grpc.ClientUnaryCall;
  postStatus(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatusResponse__Output) => void): grpc.ClientUnaryCall;
  postStatus(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatusResponse__Output) => void): grpc.ClientUnaryCall;
  postStatus(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatusResponse__Output) => void): grpc.ClientUnaryCall;
  postStatus(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_PostStatusResponse__Output) => void): grpc.ClientUnaryCall;
  
  SetCoinbase(argument: _spacemesh_v1_SetCoinbaseRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetCoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  SetCoinbase(argument: _spacemesh_v1_SetCoinbaseRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetCoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  SetCoinbase(argument: _spacemesh_v1_SetCoinbaseRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetCoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  SetCoinbase(argument: _spacemesh_v1_SetCoinbaseRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetCoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  setCoinbase(argument: _spacemesh_v1_SetCoinbaseRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetCoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  setCoinbase(argument: _spacemesh_v1_SetCoinbaseRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetCoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  setCoinbase(argument: _spacemesh_v1_SetCoinbaseRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetCoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  setCoinbase(argument: _spacemesh_v1_SetCoinbaseRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetCoinbaseResponse__Output) => void): grpc.ClientUnaryCall;
  
  SetMinGas(argument: _spacemesh_v1_SetMinGasRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetMinGasResponse__Output) => void): grpc.ClientUnaryCall;
  SetMinGas(argument: _spacemesh_v1_SetMinGasRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetMinGasResponse__Output) => void): grpc.ClientUnaryCall;
  SetMinGas(argument: _spacemesh_v1_SetMinGasRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetMinGasResponse__Output) => void): grpc.ClientUnaryCall;
  SetMinGas(argument: _spacemesh_v1_SetMinGasRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetMinGasResponse__Output) => void): grpc.ClientUnaryCall;
  setMinGas(argument: _spacemesh_v1_SetMinGasRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetMinGasResponse__Output) => void): grpc.ClientUnaryCall;
  setMinGas(argument: _spacemesh_v1_SetMinGasRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetMinGasResponse__Output) => void): grpc.ClientUnaryCall;
  setMinGas(argument: _spacemesh_v1_SetMinGasRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetMinGasResponse__Output) => void): grpc.ClientUnaryCall;
  setMinGas(argument: _spacemesh_v1_SetMinGasRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SetMinGasResponse__Output) => void): grpc.ClientUnaryCall;
  
  SmesherID(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherIDResponse__Output) => void): grpc.ClientUnaryCall;
  SmesherID(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherIDResponse__Output) => void): grpc.ClientUnaryCall;
  SmesherID(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherIDResponse__Output) => void): grpc.ClientUnaryCall;
  SmesherID(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherIDResponse__Output) => void): grpc.ClientUnaryCall;
  smesherId(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherIDResponse__Output) => void): grpc.ClientUnaryCall;
  smesherId(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherIDResponse__Output) => void): grpc.ClientUnaryCall;
  smesherId(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherIDResponse__Output) => void): grpc.ClientUnaryCall;
  smesherId(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_SmesherIDResponse__Output) => void): grpc.ClientUnaryCall;
  
  StartSmeshing(argument: _spacemesh_v1_StartSmeshingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StartSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  StartSmeshing(argument: _spacemesh_v1_StartSmeshingRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StartSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  StartSmeshing(argument: _spacemesh_v1_StartSmeshingRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StartSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  StartSmeshing(argument: _spacemesh_v1_StartSmeshingRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StartSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  startSmeshing(argument: _spacemesh_v1_StartSmeshingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StartSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  startSmeshing(argument: _spacemesh_v1_StartSmeshingRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StartSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  startSmeshing(argument: _spacemesh_v1_StartSmeshingRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StartSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  startSmeshing(argument: _spacemesh_v1_StartSmeshingRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StartSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  
  StopSmeshing(argument: _spacemesh_v1_StopSmeshingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StopSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  StopSmeshing(argument: _spacemesh_v1_StopSmeshingRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StopSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  StopSmeshing(argument: _spacemesh_v1_StopSmeshingRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StopSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  StopSmeshing(argument: _spacemesh_v1_StopSmeshingRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StopSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  stopSmeshing(argument: _spacemesh_v1_StopSmeshingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StopSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  stopSmeshing(argument: _spacemesh_v1_StopSmeshingRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StopSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  stopSmeshing(argument: _spacemesh_v1_StopSmeshingRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StopSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  stopSmeshing(argument: _spacemesh_v1_StopSmeshingRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_StopSmeshingResponse__Output) => void): grpc.ClientUnaryCall;
  
}

export interface SmesherServiceHandlers extends grpc.UntypedServiceImplementation {
  Coinbase: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _spacemesh_v1_CoinbaseResponse>;
  
  Config: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _spacemesh_v1_ConfigResponse>;
  
  EstimatedRewards: grpc.handleUnaryCall<_spacemesh_v1_EstimatedRewardsRequest__Output, _spacemesh_v1_EstimatedRewardsResponse>;
  
  IsSmeshing: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _spacemesh_v1_IsSmeshingResponse>;
  
  MinGas: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _spacemesh_v1_MinGasResponse>;
  
  PostComputeProviders: grpc.handleUnaryCall<_spacemesh_v1_PostComputeProvidersRequest__Output, _spacemesh_v1_PostComputeProvidersResponse>;
  
  PostDataCreationProgressStream: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _spacemesh_v1_PostDataCreationProgressStreamResponse>;
  
  PostStatus: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _spacemesh_v1_PostStatusResponse>;
  
  SetCoinbase: grpc.handleUnaryCall<_spacemesh_v1_SetCoinbaseRequest__Output, _spacemesh_v1_SetCoinbaseResponse>;
  
  SetMinGas: grpc.handleUnaryCall<_spacemesh_v1_SetMinGasRequest__Output, _spacemesh_v1_SetMinGasResponse>;
  
  SmesherID: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _spacemesh_v1_SmesherIDResponse>;
  
  StartSmeshing: grpc.handleUnaryCall<_spacemesh_v1_StartSmeshingRequest__Output, _spacemesh_v1_StartSmeshingResponse>;
  
  StopSmeshing: grpc.handleUnaryCall<_spacemesh_v1_StopSmeshingRequest__Output, _spacemesh_v1_StopSmeshingResponse>;
  
}

export interface SmesherServiceDefinition extends grpc.ServiceDefinition {
  Coinbase: MethodDefinition<_google_protobuf_Empty, _spacemesh_v1_CoinbaseResponse, _google_protobuf_Empty__Output, _spacemesh_v1_CoinbaseResponse__Output>
  Config: MethodDefinition<_google_protobuf_Empty, _spacemesh_v1_ConfigResponse, _google_protobuf_Empty__Output, _spacemesh_v1_ConfigResponse__Output>
  EstimatedRewards: MethodDefinition<_spacemesh_v1_EstimatedRewardsRequest, _spacemesh_v1_EstimatedRewardsResponse, _spacemesh_v1_EstimatedRewardsRequest__Output, _spacemesh_v1_EstimatedRewardsResponse__Output>
  IsSmeshing: MethodDefinition<_google_protobuf_Empty, _spacemesh_v1_IsSmeshingResponse, _google_protobuf_Empty__Output, _spacemesh_v1_IsSmeshingResponse__Output>
  MinGas: MethodDefinition<_google_protobuf_Empty, _spacemesh_v1_MinGasResponse, _google_protobuf_Empty__Output, _spacemesh_v1_MinGasResponse__Output>
  PostComputeProviders: MethodDefinition<_spacemesh_v1_PostComputeProvidersRequest, _spacemesh_v1_PostComputeProvidersResponse, _spacemesh_v1_PostComputeProvidersRequest__Output, _spacemesh_v1_PostComputeProvidersResponse__Output>
  PostDataCreationProgressStream: MethodDefinition<_google_protobuf_Empty, _spacemesh_v1_PostDataCreationProgressStreamResponse, _google_protobuf_Empty__Output, _spacemesh_v1_PostDataCreationProgressStreamResponse__Output>
  PostStatus: MethodDefinition<_google_protobuf_Empty, _spacemesh_v1_PostStatusResponse, _google_protobuf_Empty__Output, _spacemesh_v1_PostStatusResponse__Output>
  SetCoinbase: MethodDefinition<_spacemesh_v1_SetCoinbaseRequest, _spacemesh_v1_SetCoinbaseResponse, _spacemesh_v1_SetCoinbaseRequest__Output, _spacemesh_v1_SetCoinbaseResponse__Output>
  SetMinGas: MethodDefinition<_spacemesh_v1_SetMinGasRequest, _spacemesh_v1_SetMinGasResponse, _spacemesh_v1_SetMinGasRequest__Output, _spacemesh_v1_SetMinGasResponse__Output>
  SmesherID: MethodDefinition<_google_protobuf_Empty, _spacemesh_v1_SmesherIDResponse, _google_protobuf_Empty__Output, _spacemesh_v1_SmesherIDResponse__Output>
  StartSmeshing: MethodDefinition<_spacemesh_v1_StartSmeshingRequest, _spacemesh_v1_StartSmeshingResponse, _spacemesh_v1_StartSmeshingRequest__Output, _spacemesh_v1_StartSmeshingResponse__Output>
  StopSmeshing: MethodDefinition<_spacemesh_v1_StopSmeshingRequest, _spacemesh_v1_StopSmeshingResponse, _spacemesh_v1_StopSmeshingRequest__Output, _spacemesh_v1_StopSmeshingResponse__Output>
}
