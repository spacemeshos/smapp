// Original file: vendor/api/spacemesh/v1/mesh.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AccountMeshDataQueryRequest as _spacemesh_v1_AccountMeshDataQueryRequest, AccountMeshDataQueryRequest__Output as _spacemesh_v1_AccountMeshDataQueryRequest__Output } from '../../spacemesh/v1/AccountMeshDataQueryRequest';
import type { AccountMeshDataQueryResponse as _spacemesh_v1_AccountMeshDataQueryResponse, AccountMeshDataQueryResponse__Output as _spacemesh_v1_AccountMeshDataQueryResponse__Output } from '../../spacemesh/v1/AccountMeshDataQueryResponse';
import type { AccountMeshDataStreamRequest as _spacemesh_v1_AccountMeshDataStreamRequest, AccountMeshDataStreamRequest__Output as _spacemesh_v1_AccountMeshDataStreamRequest__Output } from '../../spacemesh/v1/AccountMeshDataStreamRequest';
import type { AccountMeshDataStreamResponse as _spacemesh_v1_AccountMeshDataStreamResponse, AccountMeshDataStreamResponse__Output as _spacemesh_v1_AccountMeshDataStreamResponse__Output } from '../../spacemesh/v1/AccountMeshDataStreamResponse';
import type { CurrentEpochRequest as _spacemesh_v1_CurrentEpochRequest, CurrentEpochRequest__Output as _spacemesh_v1_CurrentEpochRequest__Output } from '../../spacemesh/v1/CurrentEpochRequest';
import type { CurrentEpochResponse as _spacemesh_v1_CurrentEpochResponse, CurrentEpochResponse__Output as _spacemesh_v1_CurrentEpochResponse__Output } from '../../spacemesh/v1/CurrentEpochResponse';
import type { CurrentLayerRequest as _spacemesh_v1_CurrentLayerRequest, CurrentLayerRequest__Output as _spacemesh_v1_CurrentLayerRequest__Output } from '../../spacemesh/v1/CurrentLayerRequest';
import type { CurrentLayerResponse as _spacemesh_v1_CurrentLayerResponse, CurrentLayerResponse__Output as _spacemesh_v1_CurrentLayerResponse__Output } from '../../spacemesh/v1/CurrentLayerResponse';
import type { EpochNumLayersRequest as _spacemesh_v1_EpochNumLayersRequest, EpochNumLayersRequest__Output as _spacemesh_v1_EpochNumLayersRequest__Output } from '../../spacemesh/v1/EpochNumLayersRequest';
import type { EpochNumLayersResponse as _spacemesh_v1_EpochNumLayersResponse, EpochNumLayersResponse__Output as _spacemesh_v1_EpochNumLayersResponse__Output } from '../../spacemesh/v1/EpochNumLayersResponse';
import type { EpochStreamRequest as _spacemesh_v1_EpochStreamRequest, EpochStreamRequest__Output as _spacemesh_v1_EpochStreamRequest__Output } from '../../spacemesh/v1/EpochStreamRequest';
import type { EpochStreamResponse as _spacemesh_v1_EpochStreamResponse, EpochStreamResponse__Output as _spacemesh_v1_EpochStreamResponse__Output } from '../../spacemesh/v1/EpochStreamResponse';
import type { GenesisIDRequest as _spacemesh_v1_GenesisIDRequest, GenesisIDRequest__Output as _spacemesh_v1_GenesisIDRequest__Output } from '../../spacemesh/v1/GenesisIDRequest';
import type { GenesisIDResponse as _spacemesh_v1_GenesisIDResponse, GenesisIDResponse__Output as _spacemesh_v1_GenesisIDResponse__Output } from '../../spacemesh/v1/GenesisIDResponse';
import type { GenesisTimeRequest as _spacemesh_v1_GenesisTimeRequest, GenesisTimeRequest__Output as _spacemesh_v1_GenesisTimeRequest__Output } from '../../spacemesh/v1/GenesisTimeRequest';
import type { GenesisTimeResponse as _spacemesh_v1_GenesisTimeResponse, GenesisTimeResponse__Output as _spacemesh_v1_GenesisTimeResponse__Output } from '../../spacemesh/v1/GenesisTimeResponse';
import type { LayerDurationRequest as _spacemesh_v1_LayerDurationRequest, LayerDurationRequest__Output as _spacemesh_v1_LayerDurationRequest__Output } from '../../spacemesh/v1/LayerDurationRequest';
import type { LayerDurationResponse as _spacemesh_v1_LayerDurationResponse, LayerDurationResponse__Output as _spacemesh_v1_LayerDurationResponse__Output } from '../../spacemesh/v1/LayerDurationResponse';
import type { LayerStreamRequest as _spacemesh_v1_LayerStreamRequest, LayerStreamRequest__Output as _spacemesh_v1_LayerStreamRequest__Output } from '../../spacemesh/v1/LayerStreamRequest';
import type { LayerStreamResponse as _spacemesh_v1_LayerStreamResponse, LayerStreamResponse__Output as _spacemesh_v1_LayerStreamResponse__Output } from '../../spacemesh/v1/LayerStreamResponse';
import type { LayersQueryRequest as _spacemesh_v1_LayersQueryRequest, LayersQueryRequest__Output as _spacemesh_v1_LayersQueryRequest__Output } from '../../spacemesh/v1/LayersQueryRequest';
import type { LayersQueryResponse as _spacemesh_v1_LayersQueryResponse, LayersQueryResponse__Output as _spacemesh_v1_LayersQueryResponse__Output } from '../../spacemesh/v1/LayersQueryResponse';
import type { MalfeasanceRequest as _spacemesh_v1_MalfeasanceRequest, MalfeasanceRequest__Output as _spacemesh_v1_MalfeasanceRequest__Output } from '../../spacemesh/v1/MalfeasanceRequest';
import type { MalfeasanceResponse as _spacemesh_v1_MalfeasanceResponse, MalfeasanceResponse__Output as _spacemesh_v1_MalfeasanceResponse__Output } from '../../spacemesh/v1/MalfeasanceResponse';
import type { MalfeasanceStreamRequest as _spacemesh_v1_MalfeasanceStreamRequest, MalfeasanceStreamRequest__Output as _spacemesh_v1_MalfeasanceStreamRequest__Output } from '../../spacemesh/v1/MalfeasanceStreamRequest';
import type { MalfeasanceStreamResponse as _spacemesh_v1_MalfeasanceStreamResponse, MalfeasanceStreamResponse__Output as _spacemesh_v1_MalfeasanceStreamResponse__Output } from '../../spacemesh/v1/MalfeasanceStreamResponse';
import type { MaxTransactionsPerSecondRequest as _spacemesh_v1_MaxTransactionsPerSecondRequest, MaxTransactionsPerSecondRequest__Output as _spacemesh_v1_MaxTransactionsPerSecondRequest__Output } from '../../spacemesh/v1/MaxTransactionsPerSecondRequest';
import type { MaxTransactionsPerSecondResponse as _spacemesh_v1_MaxTransactionsPerSecondResponse, MaxTransactionsPerSecondResponse__Output as _spacemesh_v1_MaxTransactionsPerSecondResponse__Output } from '../../spacemesh/v1/MaxTransactionsPerSecondResponse';

export interface MeshServiceClient extends grpc.Client {
  AccountMeshDataQuery(argument: _spacemesh_v1_AccountMeshDataQueryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountMeshDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  AccountMeshDataQuery(argument: _spacemesh_v1_AccountMeshDataQueryRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountMeshDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  AccountMeshDataQuery(argument: _spacemesh_v1_AccountMeshDataQueryRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountMeshDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  AccountMeshDataQuery(argument: _spacemesh_v1_AccountMeshDataQueryRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountMeshDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  accountMeshDataQuery(argument: _spacemesh_v1_AccountMeshDataQueryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountMeshDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  accountMeshDataQuery(argument: _spacemesh_v1_AccountMeshDataQueryRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountMeshDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  accountMeshDataQuery(argument: _spacemesh_v1_AccountMeshDataQueryRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountMeshDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  accountMeshDataQuery(argument: _spacemesh_v1_AccountMeshDataQueryRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_AccountMeshDataQueryResponse__Output) => void): grpc.ClientUnaryCall;
  
  AccountMeshDataStream(argument: _spacemesh_v1_AccountMeshDataStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_AccountMeshDataStreamResponse__Output>;
  AccountMeshDataStream(argument: _spacemesh_v1_AccountMeshDataStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_AccountMeshDataStreamResponse__Output>;
  accountMeshDataStream(argument: _spacemesh_v1_AccountMeshDataStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_AccountMeshDataStreamResponse__Output>;
  accountMeshDataStream(argument: _spacemesh_v1_AccountMeshDataStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_AccountMeshDataStreamResponse__Output>;
  
  CurrentEpoch(argument: _spacemesh_v1_CurrentEpochRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentEpochResponse__Output) => void): grpc.ClientUnaryCall;
  CurrentEpoch(argument: _spacemesh_v1_CurrentEpochRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentEpochResponse__Output) => void): grpc.ClientUnaryCall;
  CurrentEpoch(argument: _spacemesh_v1_CurrentEpochRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentEpochResponse__Output) => void): grpc.ClientUnaryCall;
  CurrentEpoch(argument: _spacemesh_v1_CurrentEpochRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentEpochResponse__Output) => void): grpc.ClientUnaryCall;
  currentEpoch(argument: _spacemesh_v1_CurrentEpochRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentEpochResponse__Output) => void): grpc.ClientUnaryCall;
  currentEpoch(argument: _spacemesh_v1_CurrentEpochRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentEpochResponse__Output) => void): grpc.ClientUnaryCall;
  currentEpoch(argument: _spacemesh_v1_CurrentEpochRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentEpochResponse__Output) => void): grpc.ClientUnaryCall;
  currentEpoch(argument: _spacemesh_v1_CurrentEpochRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentEpochResponse__Output) => void): grpc.ClientUnaryCall;
  
  CurrentLayer(argument: _spacemesh_v1_CurrentLayerRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentLayerResponse__Output) => void): grpc.ClientUnaryCall;
  CurrentLayer(argument: _spacemesh_v1_CurrentLayerRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentLayerResponse__Output) => void): grpc.ClientUnaryCall;
  CurrentLayer(argument: _spacemesh_v1_CurrentLayerRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentLayerResponse__Output) => void): grpc.ClientUnaryCall;
  CurrentLayer(argument: _spacemesh_v1_CurrentLayerRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentLayerResponse__Output) => void): grpc.ClientUnaryCall;
  currentLayer(argument: _spacemesh_v1_CurrentLayerRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentLayerResponse__Output) => void): grpc.ClientUnaryCall;
  currentLayer(argument: _spacemesh_v1_CurrentLayerRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentLayerResponse__Output) => void): grpc.ClientUnaryCall;
  currentLayer(argument: _spacemesh_v1_CurrentLayerRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentLayerResponse__Output) => void): grpc.ClientUnaryCall;
  currentLayer(argument: _spacemesh_v1_CurrentLayerRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_CurrentLayerResponse__Output) => void): grpc.ClientUnaryCall;
  
  EpochNumLayers(argument: _spacemesh_v1_EpochNumLayersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EpochNumLayersResponse__Output) => void): grpc.ClientUnaryCall;
  EpochNumLayers(argument: _spacemesh_v1_EpochNumLayersRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EpochNumLayersResponse__Output) => void): grpc.ClientUnaryCall;
  EpochNumLayers(argument: _spacemesh_v1_EpochNumLayersRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EpochNumLayersResponse__Output) => void): grpc.ClientUnaryCall;
  EpochNumLayers(argument: _spacemesh_v1_EpochNumLayersRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EpochNumLayersResponse__Output) => void): grpc.ClientUnaryCall;
  epochNumLayers(argument: _spacemesh_v1_EpochNumLayersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EpochNumLayersResponse__Output) => void): grpc.ClientUnaryCall;
  epochNumLayers(argument: _spacemesh_v1_EpochNumLayersRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EpochNumLayersResponse__Output) => void): grpc.ClientUnaryCall;
  epochNumLayers(argument: _spacemesh_v1_EpochNumLayersRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EpochNumLayersResponse__Output) => void): grpc.ClientUnaryCall;
  epochNumLayers(argument: _spacemesh_v1_EpochNumLayersRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_EpochNumLayersResponse__Output) => void): grpc.ClientUnaryCall;
  
  EpochStream(argument: _spacemesh_v1_EpochStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_EpochStreamResponse__Output>;
  EpochStream(argument: _spacemesh_v1_EpochStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_EpochStreamResponse__Output>;
  epochStream(argument: _spacemesh_v1_EpochStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_EpochStreamResponse__Output>;
  epochStream(argument: _spacemesh_v1_EpochStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_EpochStreamResponse__Output>;
  
  GenesisID(argument: _spacemesh_v1_GenesisIDRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisIDResponse__Output) => void): grpc.ClientUnaryCall;
  GenesisID(argument: _spacemesh_v1_GenesisIDRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisIDResponse__Output) => void): grpc.ClientUnaryCall;
  GenesisID(argument: _spacemesh_v1_GenesisIDRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisIDResponse__Output) => void): grpc.ClientUnaryCall;
  GenesisID(argument: _spacemesh_v1_GenesisIDRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisIDResponse__Output) => void): grpc.ClientUnaryCall;
  genesisId(argument: _spacemesh_v1_GenesisIDRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisIDResponse__Output) => void): grpc.ClientUnaryCall;
  genesisId(argument: _spacemesh_v1_GenesisIDRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisIDResponse__Output) => void): grpc.ClientUnaryCall;
  genesisId(argument: _spacemesh_v1_GenesisIDRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisIDResponse__Output) => void): grpc.ClientUnaryCall;
  genesisId(argument: _spacemesh_v1_GenesisIDRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisIDResponse__Output) => void): grpc.ClientUnaryCall;
  
  GenesisTime(argument: _spacemesh_v1_GenesisTimeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisTimeResponse__Output) => void): grpc.ClientUnaryCall;
  GenesisTime(argument: _spacemesh_v1_GenesisTimeRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisTimeResponse__Output) => void): grpc.ClientUnaryCall;
  GenesisTime(argument: _spacemesh_v1_GenesisTimeRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisTimeResponse__Output) => void): grpc.ClientUnaryCall;
  GenesisTime(argument: _spacemesh_v1_GenesisTimeRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisTimeResponse__Output) => void): grpc.ClientUnaryCall;
  genesisTime(argument: _spacemesh_v1_GenesisTimeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisTimeResponse__Output) => void): grpc.ClientUnaryCall;
  genesisTime(argument: _spacemesh_v1_GenesisTimeRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisTimeResponse__Output) => void): grpc.ClientUnaryCall;
  genesisTime(argument: _spacemesh_v1_GenesisTimeRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisTimeResponse__Output) => void): grpc.ClientUnaryCall;
  genesisTime(argument: _spacemesh_v1_GenesisTimeRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_GenesisTimeResponse__Output) => void): grpc.ClientUnaryCall;
  
  LayerDuration(argument: _spacemesh_v1_LayerDurationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayerDurationResponse__Output) => void): grpc.ClientUnaryCall;
  LayerDuration(argument: _spacemesh_v1_LayerDurationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayerDurationResponse__Output) => void): grpc.ClientUnaryCall;
  LayerDuration(argument: _spacemesh_v1_LayerDurationRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayerDurationResponse__Output) => void): grpc.ClientUnaryCall;
  LayerDuration(argument: _spacemesh_v1_LayerDurationRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayerDurationResponse__Output) => void): grpc.ClientUnaryCall;
  layerDuration(argument: _spacemesh_v1_LayerDurationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayerDurationResponse__Output) => void): grpc.ClientUnaryCall;
  layerDuration(argument: _spacemesh_v1_LayerDurationRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayerDurationResponse__Output) => void): grpc.ClientUnaryCall;
  layerDuration(argument: _spacemesh_v1_LayerDurationRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayerDurationResponse__Output) => void): grpc.ClientUnaryCall;
  layerDuration(argument: _spacemesh_v1_LayerDurationRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayerDurationResponse__Output) => void): grpc.ClientUnaryCall;
  
  LayerStream(argument: _spacemesh_v1_LayerStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_LayerStreamResponse__Output>;
  LayerStream(argument: _spacemesh_v1_LayerStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_LayerStreamResponse__Output>;
  layerStream(argument: _spacemesh_v1_LayerStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_LayerStreamResponse__Output>;
  layerStream(argument: _spacemesh_v1_LayerStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_LayerStreamResponse__Output>;
  
  LayersQuery(argument: _spacemesh_v1_LayersQueryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayersQueryResponse__Output) => void): grpc.ClientUnaryCall;
  LayersQuery(argument: _spacemesh_v1_LayersQueryRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayersQueryResponse__Output) => void): grpc.ClientUnaryCall;
  LayersQuery(argument: _spacemesh_v1_LayersQueryRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayersQueryResponse__Output) => void): grpc.ClientUnaryCall;
  LayersQuery(argument: _spacemesh_v1_LayersQueryRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayersQueryResponse__Output) => void): grpc.ClientUnaryCall;
  layersQuery(argument: _spacemesh_v1_LayersQueryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayersQueryResponse__Output) => void): grpc.ClientUnaryCall;
  layersQuery(argument: _spacemesh_v1_LayersQueryRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayersQueryResponse__Output) => void): grpc.ClientUnaryCall;
  layersQuery(argument: _spacemesh_v1_LayersQueryRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayersQueryResponse__Output) => void): grpc.ClientUnaryCall;
  layersQuery(argument: _spacemesh_v1_LayersQueryRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_LayersQueryResponse__Output) => void): grpc.ClientUnaryCall;
  
  MalfeasanceQuery(argument: _spacemesh_v1_MalfeasanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MalfeasanceResponse__Output) => void): grpc.ClientUnaryCall;
  MalfeasanceQuery(argument: _spacemesh_v1_MalfeasanceRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MalfeasanceResponse__Output) => void): grpc.ClientUnaryCall;
  MalfeasanceQuery(argument: _spacemesh_v1_MalfeasanceRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MalfeasanceResponse__Output) => void): grpc.ClientUnaryCall;
  MalfeasanceQuery(argument: _spacemesh_v1_MalfeasanceRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MalfeasanceResponse__Output) => void): grpc.ClientUnaryCall;
  malfeasanceQuery(argument: _spacemesh_v1_MalfeasanceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MalfeasanceResponse__Output) => void): grpc.ClientUnaryCall;
  malfeasanceQuery(argument: _spacemesh_v1_MalfeasanceRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MalfeasanceResponse__Output) => void): grpc.ClientUnaryCall;
  malfeasanceQuery(argument: _spacemesh_v1_MalfeasanceRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MalfeasanceResponse__Output) => void): grpc.ClientUnaryCall;
  malfeasanceQuery(argument: _spacemesh_v1_MalfeasanceRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MalfeasanceResponse__Output) => void): grpc.ClientUnaryCall;
  
  MalfeasanceStream(argument: _spacemesh_v1_MalfeasanceStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_MalfeasanceStreamResponse__Output>;
  MalfeasanceStream(argument: _spacemesh_v1_MalfeasanceStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_MalfeasanceStreamResponse__Output>;
  malfeasanceStream(argument: _spacemesh_v1_MalfeasanceStreamRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_MalfeasanceStreamResponse__Output>;
  malfeasanceStream(argument: _spacemesh_v1_MalfeasanceStreamRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_spacemesh_v1_MalfeasanceStreamResponse__Output>;
  
  MaxTransactionsPerSecond(argument: _spacemesh_v1_MaxTransactionsPerSecondRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MaxTransactionsPerSecondResponse__Output) => void): grpc.ClientUnaryCall;
  MaxTransactionsPerSecond(argument: _spacemesh_v1_MaxTransactionsPerSecondRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MaxTransactionsPerSecondResponse__Output) => void): grpc.ClientUnaryCall;
  MaxTransactionsPerSecond(argument: _spacemesh_v1_MaxTransactionsPerSecondRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MaxTransactionsPerSecondResponse__Output) => void): grpc.ClientUnaryCall;
  MaxTransactionsPerSecond(argument: _spacemesh_v1_MaxTransactionsPerSecondRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MaxTransactionsPerSecondResponse__Output) => void): grpc.ClientUnaryCall;
  maxTransactionsPerSecond(argument: _spacemesh_v1_MaxTransactionsPerSecondRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MaxTransactionsPerSecondResponse__Output) => void): grpc.ClientUnaryCall;
  maxTransactionsPerSecond(argument: _spacemesh_v1_MaxTransactionsPerSecondRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MaxTransactionsPerSecondResponse__Output) => void): grpc.ClientUnaryCall;
  maxTransactionsPerSecond(argument: _spacemesh_v1_MaxTransactionsPerSecondRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MaxTransactionsPerSecondResponse__Output) => void): grpc.ClientUnaryCall;
  maxTransactionsPerSecond(argument: _spacemesh_v1_MaxTransactionsPerSecondRequest, callback: (error?: grpc.ServiceError, result?: _spacemesh_v1_MaxTransactionsPerSecondResponse__Output) => void): grpc.ClientUnaryCall;
  
}

export interface MeshServiceHandlers extends grpc.UntypedServiceImplementation {
  AccountMeshDataQuery: grpc.handleUnaryCall<_spacemesh_v1_AccountMeshDataQueryRequest__Output, _spacemesh_v1_AccountMeshDataQueryResponse>;
  
  AccountMeshDataStream: grpc.handleServerStreamingCall<_spacemesh_v1_AccountMeshDataStreamRequest__Output, _spacemesh_v1_AccountMeshDataStreamResponse>;
  
  CurrentEpoch: grpc.handleUnaryCall<_spacemesh_v1_CurrentEpochRequest__Output, _spacemesh_v1_CurrentEpochResponse>;
  
  CurrentLayer: grpc.handleUnaryCall<_spacemesh_v1_CurrentLayerRequest__Output, _spacemesh_v1_CurrentLayerResponse>;
  
  EpochNumLayers: grpc.handleUnaryCall<_spacemesh_v1_EpochNumLayersRequest__Output, _spacemesh_v1_EpochNumLayersResponse>;
  
  EpochStream: grpc.handleServerStreamingCall<_spacemesh_v1_EpochStreamRequest__Output, _spacemesh_v1_EpochStreamResponse>;
  
  GenesisID: grpc.handleUnaryCall<_spacemesh_v1_GenesisIDRequest__Output, _spacemesh_v1_GenesisIDResponse>;
  
  GenesisTime: grpc.handleUnaryCall<_spacemesh_v1_GenesisTimeRequest__Output, _spacemesh_v1_GenesisTimeResponse>;
  
  LayerDuration: grpc.handleUnaryCall<_spacemesh_v1_LayerDurationRequest__Output, _spacemesh_v1_LayerDurationResponse>;
  
  LayerStream: grpc.handleServerStreamingCall<_spacemesh_v1_LayerStreamRequest__Output, _spacemesh_v1_LayerStreamResponse>;
  
  LayersQuery: grpc.handleUnaryCall<_spacemesh_v1_LayersQueryRequest__Output, _spacemesh_v1_LayersQueryResponse>;
  
  MalfeasanceQuery: grpc.handleUnaryCall<_spacemesh_v1_MalfeasanceRequest__Output, _spacemesh_v1_MalfeasanceResponse>;
  
  MalfeasanceStream: grpc.handleServerStreamingCall<_spacemesh_v1_MalfeasanceStreamRequest__Output, _spacemesh_v1_MalfeasanceStreamResponse>;
  
  MaxTransactionsPerSecond: grpc.handleUnaryCall<_spacemesh_v1_MaxTransactionsPerSecondRequest__Output, _spacemesh_v1_MaxTransactionsPerSecondResponse>;
  
}

export interface MeshServiceDefinition extends grpc.ServiceDefinition {
  AccountMeshDataQuery: MethodDefinition<_spacemesh_v1_AccountMeshDataQueryRequest, _spacemesh_v1_AccountMeshDataQueryResponse, _spacemesh_v1_AccountMeshDataQueryRequest__Output, _spacemesh_v1_AccountMeshDataQueryResponse__Output>
  AccountMeshDataStream: MethodDefinition<_spacemesh_v1_AccountMeshDataStreamRequest, _spacemesh_v1_AccountMeshDataStreamResponse, _spacemesh_v1_AccountMeshDataStreamRequest__Output, _spacemesh_v1_AccountMeshDataStreamResponse__Output>
  CurrentEpoch: MethodDefinition<_spacemesh_v1_CurrentEpochRequest, _spacemesh_v1_CurrentEpochResponse, _spacemesh_v1_CurrentEpochRequest__Output, _spacemesh_v1_CurrentEpochResponse__Output>
  CurrentLayer: MethodDefinition<_spacemesh_v1_CurrentLayerRequest, _spacemesh_v1_CurrentLayerResponse, _spacemesh_v1_CurrentLayerRequest__Output, _spacemesh_v1_CurrentLayerResponse__Output>
  EpochNumLayers: MethodDefinition<_spacemesh_v1_EpochNumLayersRequest, _spacemesh_v1_EpochNumLayersResponse, _spacemesh_v1_EpochNumLayersRequest__Output, _spacemesh_v1_EpochNumLayersResponse__Output>
  EpochStream: MethodDefinition<_spacemesh_v1_EpochStreamRequest, _spacemesh_v1_EpochStreamResponse, _spacemesh_v1_EpochStreamRequest__Output, _spacemesh_v1_EpochStreamResponse__Output>
  GenesisID: MethodDefinition<_spacemesh_v1_GenesisIDRequest, _spacemesh_v1_GenesisIDResponse, _spacemesh_v1_GenesisIDRequest__Output, _spacemesh_v1_GenesisIDResponse__Output>
  GenesisTime: MethodDefinition<_spacemesh_v1_GenesisTimeRequest, _spacemesh_v1_GenesisTimeResponse, _spacemesh_v1_GenesisTimeRequest__Output, _spacemesh_v1_GenesisTimeResponse__Output>
  LayerDuration: MethodDefinition<_spacemesh_v1_LayerDurationRequest, _spacemesh_v1_LayerDurationResponse, _spacemesh_v1_LayerDurationRequest__Output, _spacemesh_v1_LayerDurationResponse__Output>
  LayerStream: MethodDefinition<_spacemesh_v1_LayerStreamRequest, _spacemesh_v1_LayerStreamResponse, _spacemesh_v1_LayerStreamRequest__Output, _spacemesh_v1_LayerStreamResponse__Output>
  LayersQuery: MethodDefinition<_spacemesh_v1_LayersQueryRequest, _spacemesh_v1_LayersQueryResponse, _spacemesh_v1_LayersQueryRequest__Output, _spacemesh_v1_LayersQueryResponse__Output>
  MalfeasanceQuery: MethodDefinition<_spacemesh_v1_MalfeasanceRequest, _spacemesh_v1_MalfeasanceResponse, _spacemesh_v1_MalfeasanceRequest__Output, _spacemesh_v1_MalfeasanceResponse__Output>
  MalfeasanceStream: MethodDefinition<_spacemesh_v1_MalfeasanceStreamRequest, _spacemesh_v1_MalfeasanceStreamResponse, _spacemesh_v1_MalfeasanceStreamRequest__Output, _spacemesh_v1_MalfeasanceStreamResponse__Output>
  MaxTransactionsPerSecond: MethodDefinition<_spacemesh_v1_MaxTransactionsPerSecondRequest, _spacemesh_v1_MaxTransactionsPerSecondResponse, _spacemesh_v1_MaxTransactionsPerSecondRequest__Output, _spacemesh_v1_MaxTransactionsPerSecondResponse__Output>
}
