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
  coinbase?: string;
  dataDir: string;
  numUnits: number;
  numFiles?: number;
  computeProviderId: number;
  throttle: boolean;
}

export enum PostSetupState {
  STATE_UNSPECIFIED = 0, // Lane's favorite impossible value
  STATE_NOT_STARTED, // Setup not started
  STATE_IN_PROGRESS, // Setup in progress
  STATE_COMPLETE, // Setup is complete
  STATE_ERROR
}

export interface PostSetupStatus {
  postSetupState: PostSetupState;
  numLabelsWritten: number;
  opts: PostSetupOpts;
  errorMessage: string;
}
