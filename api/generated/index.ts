import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { ActivationServiceClient as _spacemesh_v1_ActivationServiceClient, ActivationServiceDefinition as _spacemesh_v1_ActivationServiceDefinition } from './spacemesh/v1/ActivationService';
import type { AdminServiceClient as _spacemesh_v1_AdminServiceClient, AdminServiceDefinition as _spacemesh_v1_AdminServiceDefinition } from './spacemesh/v1/AdminService';
import type { DebugServiceClient as _spacemesh_v1_DebugServiceClient, DebugServiceDefinition as _spacemesh_v1_DebugServiceDefinition } from './spacemesh/v1/DebugService';
import type { GlobalStateServiceClient as _spacemesh_v1_GlobalStateServiceClient, GlobalStateServiceDefinition as _spacemesh_v1_GlobalStateServiceDefinition } from './spacemesh/v1/GlobalStateService';
import type { MeshServiceClient as _spacemesh_v1_MeshServiceClient, MeshServiceDefinition as _spacemesh_v1_MeshServiceDefinition } from './spacemesh/v1/MeshService';
import type { NodeServiceClient as _spacemesh_v1_NodeServiceClient, NodeServiceDefinition as _spacemesh_v1_NodeServiceDefinition } from './spacemesh/v1/NodeService';
import type { PostServiceClient as _spacemesh_v1_PostServiceClient, PostServiceDefinition as _spacemesh_v1_PostServiceDefinition } from './spacemesh/v1/PostService';
import type { SmesherServiceClient as _spacemesh_v1_SmesherServiceClient, SmesherServiceDefinition as _spacemesh_v1_SmesherServiceDefinition } from './spacemesh/v1/SmesherService';
import type { TransactionServiceClient as _spacemesh_v1_TransactionServiceClient, TransactionServiceDefinition as _spacemesh_v1_TransactionServiceDefinition } from './spacemesh/v1/TransactionService';
import type { ActivationServiceClient as _spacemesh_v2alpha1_ActivationServiceClient, ActivationServiceDefinition as _spacemesh_v2alpha1_ActivationServiceDefinition } from './spacemesh/v2alpha1/ActivationService';
import type { ActivationStreamServiceClient as _spacemesh_v2alpha1_ActivationStreamServiceClient, ActivationStreamServiceDefinition as _spacemesh_v2alpha1_ActivationStreamServiceDefinition } from './spacemesh/v2alpha1/ActivationStreamService';
import type { RewardServiceClient as _spacemesh_v2alpha1_RewardServiceClient, RewardServiceDefinition as _spacemesh_v2alpha1_RewardServiceDefinition } from './spacemesh/v2alpha1/RewardService';
import type { RewardStreamServiceClient as _spacemesh_v2alpha1_RewardStreamServiceClient, RewardStreamServiceDefinition as _spacemesh_v2alpha1_RewardStreamServiceDefinition } from './spacemesh/v2alpha1/RewardStreamService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    api: {
      CustomHttpPattern: MessageTypeDefinition
      Http: MessageTypeDefinition
      HttpRule: MessageTypeDefinition
    }
    protobuf: {
      Any: MessageTypeDefinition
      DescriptorProto: MessageTypeDefinition
      Duration: MessageTypeDefinition
      Empty: MessageTypeDefinition
      EnumDescriptorProto: MessageTypeDefinition
      EnumOptions: MessageTypeDefinition
      EnumValueDescriptorProto: MessageTypeDefinition
      EnumValueOptions: MessageTypeDefinition
      FieldDescriptorProto: MessageTypeDefinition
      FieldOptions: MessageTypeDefinition
      FileDescriptorProto: MessageTypeDefinition
      FileDescriptorSet: MessageTypeDefinition
      FileOptions: MessageTypeDefinition
      GeneratedCodeInfo: MessageTypeDefinition
      MessageOptions: MessageTypeDefinition
      MethodDescriptorProto: MessageTypeDefinition
      MethodOptions: MessageTypeDefinition
      OneofDescriptorProto: MessageTypeDefinition
      OneofOptions: MessageTypeDefinition
      ServiceDescriptorProto: MessageTypeDefinition
      ServiceOptions: MessageTypeDefinition
      SourceCodeInfo: MessageTypeDefinition
      Timestamp: MessageTypeDefinition
      UninterpretedOption: MessageTypeDefinition
    }
    rpc: {
      Status: MessageTypeDefinition
    }
  }
  spacemesh: {
    v1: {
      Account: MessageTypeDefinition
      AccountData: MessageTypeDefinition
      AccountDataFilter: MessageTypeDefinition
      AccountDataFlag: EnumTypeDefinition
      AccountDataQueryRequest: MessageTypeDefinition
      AccountDataQueryResponse: MessageTypeDefinition
      AccountDataStreamRequest: MessageTypeDefinition
      AccountDataStreamResponse: MessageTypeDefinition
      AccountId: MessageTypeDefinition
      AccountMeshData: MessageTypeDefinition
      AccountMeshDataFilter: MessageTypeDefinition
      AccountMeshDataFlag: EnumTypeDefinition
      AccountMeshDataQueryRequest: MessageTypeDefinition
      AccountMeshDataQueryResponse: MessageTypeDefinition
      AccountMeshDataStreamRequest: MessageTypeDefinition
      AccountMeshDataStreamResponse: MessageTypeDefinition
      AccountRequest: MessageTypeDefinition
      AccountResponse: MessageTypeDefinition
      AccountState: MessageTypeDefinition
      AccountsRequest: MessageTypeDefinition
      AccountsResponse: MessageTypeDefinition
      Activation: MessageTypeDefinition
      ActivationId: MessageTypeDefinition
      ActivationService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_ActivationServiceClient> & { service: _spacemesh_v1_ActivationServiceDefinition }
      ActiveSetRequest: MessageTypeDefinition
      ActiveSetResponse: MessageTypeDefinition
      AdminService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_AdminServiceClient> & { service: _spacemesh_v1_AdminServiceDefinition }
      Amount: MessageTypeDefinition
      AppEvent: MessageTypeDefinition
      AppEventStreamRequest: MessageTypeDefinition
      AppEventStreamResponse: MessageTypeDefinition
      Block: MessageTypeDefinition
      BuildResponse: MessageTypeDefinition
      CheckpointStreamRequest: MessageTypeDefinition
      CheckpointStreamResponse: MessageTypeDefinition
      CoinbaseResponse: MessageTypeDefinition
      ConnectionInfo: MessageTypeDefinition
      CurrentEpochRequest: MessageTypeDefinition
      CurrentEpochResponse: MessageTypeDefinition
      CurrentLayerRequest: MessageTypeDefinition
      CurrentLayerResponse: MessageTypeDefinition
      DebugService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_DebugServiceClient> & { service: _spacemesh_v1_DebugServiceDefinition }
      EchoRequest: MessageTypeDefinition
      EchoResponse: MessageTypeDefinition
      Eligibility: MessageTypeDefinition
      EpochData: MessageTypeDefinition
      EpochNumLayersRequest: MessageTypeDefinition
      EpochNumLayersResponse: MessageTypeDefinition
      EpochNumber: MessageTypeDefinition
      EpochStreamRequest: MessageTypeDefinition
      EpochStreamResponse: MessageTypeDefinition
      ErrorStreamRequest: MessageTypeDefinition
      ErrorStreamResponse: MessageTypeDefinition
      EstimatedRewardsRequest: MessageTypeDefinition
      EstimatedRewardsResponse: MessageTypeDefinition
      Event: MessageTypeDefinition
      EventAtxPubished: MessageTypeDefinition
      EventBeacon: MessageTypeDefinition
      EventEligibilities: MessageTypeDefinition
      EventInitComplete: MessageTypeDefinition
      EventInitFailed: MessageTypeDefinition
      EventInitStart: MessageTypeDefinition
      EventMalfeasance: MessageTypeDefinition
      EventPoetWaitProof: MessageTypeDefinition
      EventPoetWaitRound: MessageTypeDefinition
      EventPostComplete: MessageTypeDefinition
      EventPostServiceStarted: MessageTypeDefinition
      EventPostServiceStopped: MessageTypeDefinition
      EventPostStart: MessageTypeDefinition
      EventProposal: MessageTypeDefinition
      EventStreamRequest: MessageTypeDefinition
      GenProofRequest: MessageTypeDefinition
      GenProofResponse: MessageTypeDefinition
      GenProofStatus: EnumTypeDefinition
      GenesisIDRequest: MessageTypeDefinition
      GenesisIDResponse: MessageTypeDefinition
      GenesisTimeRequest: MessageTypeDefinition
      GenesisTimeResponse: MessageTypeDefinition
      GetRequest: MessageTypeDefinition
      GetResponse: MessageTypeDefinition
      GlobalStateData: MessageTypeDefinition
      GlobalStateDataFlag: EnumTypeDefinition
      GlobalStateHash: MessageTypeDefinition
      GlobalStateHashRequest: MessageTypeDefinition
      GlobalStateHashResponse: MessageTypeDefinition
      GlobalStateService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_GlobalStateServiceClient> & { service: _spacemesh_v1_GlobalStateServiceDefinition }
      GlobalStateStreamRequest: MessageTypeDefinition
      GlobalStateStreamResponse: MessageTypeDefinition
      HighestResponse: MessageTypeDefinition
      IsSmeshingResponse: MessageTypeDefinition
      Layer: MessageTypeDefinition
      LayerDurationRequest: MessageTypeDefinition
      LayerDurationResponse: MessageTypeDefinition
      LayerLimits: MessageTypeDefinition
      LayerNumber: MessageTypeDefinition
      LayerStreamRequest: MessageTypeDefinition
      LayerStreamResponse: MessageTypeDefinition
      LayersQueryRequest: MessageTypeDefinition
      LayersQueryResponse: MessageTypeDefinition
      LogLevel: EnumTypeDefinition
      MalfeasanceProof: MessageTypeDefinition
      MalfeasanceRequest: MessageTypeDefinition
      MalfeasanceResponse: MessageTypeDefinition
      MalfeasanceStreamRequest: MessageTypeDefinition
      MalfeasanceStreamResponse: MessageTypeDefinition
      MaxTransactionsPerSecondRequest: MessageTypeDefinition
      MaxTransactionsPerSecondResponse: MessageTypeDefinition
      MeshService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_MeshServiceClient> & { service: _spacemesh_v1_MeshServiceDefinition }
      MeshTransaction: MessageTypeDefinition
      Metadata: MessageTypeDefinition
      MetadataRequest: MessageTypeDefinition
      MetadataResponse: MessageTypeDefinition
      MinGasResponse: MessageTypeDefinition
      NetworkInfoResponse: MessageTypeDefinition
      NodeError: MessageTypeDefinition
      NodeInfoResponse: MessageTypeDefinition
      NodeRequest: MessageTypeDefinition
      NodeService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_NodeServiceClient> & { service: _spacemesh_v1_NodeServiceDefinition }
      NodeStatus: MessageTypeDefinition
      Nonce: MessageTypeDefinition
      ParseTransactionRequest: MessageTypeDefinition
      ParseTransactionResponse: MessageTypeDefinition
      PeerInfo: MessageTypeDefinition
      PostConfigResponse: MessageTypeDefinition
      PostService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_PostServiceClient> & { service: _spacemesh_v1_PostServiceDefinition }
      PostSetupOpts: MessageTypeDefinition
      PostSetupProvider: MessageTypeDefinition
      PostSetupProvidersRequest: MessageTypeDefinition
      PostSetupProvidersResponse: MessageTypeDefinition
      PostSetupStatus: MessageTypeDefinition
      PostSetupStatusResponse: MessageTypeDefinition
      PostSetupStatusStreamResponse: MessageTypeDefinition
      Proof: MessageTypeDefinition
      ProofMetadata: MessageTypeDefinition
      Proposal: MessageTypeDefinition
      ProposalEligibility: MessageTypeDefinition
      RecoverRequest: MessageTypeDefinition
      Reward: MessageTypeDefinition
      ServiceResponse: MessageTypeDefinition
      SetCoinbaseRequest: MessageTypeDefinition
      SetCoinbaseResponse: MessageTypeDefinition
      SetMinGasRequest: MessageTypeDefinition
      SetMinGasResponse: MessageTypeDefinition
      SimpleInt: MessageTypeDefinition
      SimpleString: MessageTypeDefinition
      SmesherDataQueryRequest: MessageTypeDefinition
      SmesherDataQueryResponse: MessageTypeDefinition
      SmesherIDResponse: MessageTypeDefinition
      SmesherIDsResponse: MessageTypeDefinition
      SmesherId: MessageTypeDefinition
      SmesherRewardStreamRequest: MessageTypeDefinition
      SmesherRewardStreamResponse: MessageTypeDefinition
      SmesherService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_SmesherServiceClient> & { service: _spacemesh_v1_SmesherServiceDefinition }
      StartSmeshingRequest: MessageTypeDefinition
      StartSmeshingResponse: MessageTypeDefinition
      StatusRequest: MessageTypeDefinition
      StatusResponse: MessageTypeDefinition
      StatusStreamRequest: MessageTypeDefinition
      StatusStreamResponse: MessageTypeDefinition
      StopSmeshingRequest: MessageTypeDefinition
      StopSmeshingResponse: MessageTypeDefinition
      SubmitTransactionRequest: MessageTypeDefinition
      SubmitTransactionResponse: MessageTypeDefinition
      Transaction: MessageTypeDefinition
      TransactionId: MessageTypeDefinition
      TransactionReceipt: MessageTypeDefinition
      TransactionResult: MessageTypeDefinition
      TransactionResultsRequest: MessageTypeDefinition
      TransactionService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v1_TransactionServiceClient> & { service: _spacemesh_v1_TransactionServiceDefinition }
      TransactionState: MessageTypeDefinition
      TransactionsIds: MessageTypeDefinition
      TransactionsStateRequest: MessageTypeDefinition
      TransactionsStateResponse: MessageTypeDefinition
      TransactionsStateStreamRequest: MessageTypeDefinition
      TransactionsStateStreamResponse: MessageTypeDefinition
      VersionResponse: MessageTypeDefinition
    }
    v2alpha1: {
      Activation: MessageTypeDefinition
      ActivationList: MessageTypeDefinition
      ActivationRequest: MessageTypeDefinition
      ActivationService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v2alpha1_ActivationServiceClient> & { service: _spacemesh_v2alpha1_ActivationServiceDefinition }
      ActivationStreamRequest: MessageTypeDefinition
      ActivationStreamService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v2alpha1_ActivationStreamServiceClient> & { service: _spacemesh_v2alpha1_ActivationStreamServiceDefinition }
      ActivationV1: MessageTypeDefinition
      ActivationsCountRequest: MessageTypeDefinition
      ActivationsCountResponse: MessageTypeDefinition
      PoetMembershipProof: MessageTypeDefinition
      Post: MessageTypeDefinition
      PostMeta: MessageTypeDefinition
      Reward: MessageTypeDefinition
      RewardList: MessageTypeDefinition
      RewardRequest: MessageTypeDefinition
      RewardService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v2alpha1_RewardServiceClient> & { service: _spacemesh_v2alpha1_RewardServiceDefinition }
      RewardStreamRequest: MessageTypeDefinition
      RewardStreamService: SubtypeConstructor<typeof grpc.Client, _spacemesh_v2alpha1_RewardStreamServiceClient> & { service: _spacemesh_v2alpha1_RewardStreamServiceDefinition }
      RewardV1: MessageTypeDefinition
      VRFPostIndex: MessageTypeDefinition
    }
  }
}

