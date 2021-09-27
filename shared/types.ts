import { _spacemesh_v1_PostSetupStatus_State } from '../proto/spacemesh/v1/PostSetupStatus';

export { _spacemesh_v1_PostSetupStatus_State as PostSetupState };

export interface NodeVersionAndBuild {
  version: string;
  build: string;
}

export interface NodeStatus {
  connectedPeers: number;
  isSynced: boolean;
  syncedLayer: number;
  topLayer: number;
  verifiedLayer: number;
}

export enum NodeErrorLevel {
  LOG_LEVEL_UNSPECIFIED = 0,
  LOG_LEVEL_DEBUG = 1,
  LOG_LEVEL_INFO = 2,
  LOG_LEVEL_WARN = 3,
  LOG_LEVEL_ERROR = 4,
  LOG_LEVEL_DPANIC = 5,
  LOG_LEVEL_PANIC = 6,
  LOG_LEVEL_FATAL = 7
}

export interface NodeError {
  level: NodeErrorLevel;
  module: string;
  msg: string;
  stackTrace: string;
}

export interface SmesherConfig {
  bitsPerLabel: number;
  labelsPerUnit: number;
  minNumUnits: number;
  maxNumUnits: number;
}

export enum ComputeApiClass {
  COMPUTE_API_CLASS_UNSPECIFIED = 0,
  COMPUTE_API_CLASS_CPU,
  COMPUTE_API_CLASS_CUDA,
  COMPUTE_API_CLASS_VULKAN
}

export interface PostSetupComputeProvider {
  id: number;
  model: string;
  computeApi: ComputeApiClass;
  performance: number;
}

export interface PostSetupOpts {
  coinbase: string;
  dataDir: string;
  numUnits: number;
  numFiles: number;
  computeProviderId: number;
  throttle: boolean;
}

export interface PostSetupStatus {
  postSetupState: _spacemesh_v1_PostSetupStatus_State;
  numLabelsWritten: number;
  opts: PostSetupOpts | null;
  errorMessage: string;
}
