import { _spacemesh_v1_PostSetupStatus_State as PostSetupState } from '../../proto/spacemesh/v1/PostSetupStatus';

// Core

export { PostSetupState };

export interface SmesherConfig {
  bitsPerLabel: number;
  labelsPerUnit: number;
  minNumUnits: number;
  maxNumUnits: number;
}

export interface SmeshingOpts {
  coinbase: string;
  dataDir: string;
  numUnits: number;
  provider: number;
  throttle: boolean;
}

export enum ComputeApiClass {
  COMPUTE_API_CLASS_UNSPECIFIED = 0,
  COMPUTE_API_CLASS_CPU,
  COMPUTE_API_CLASS_CUDA,
  COMPUTE_API_CLASS_VULKAN,
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
  postSetupState: PostSetupState;
  numLabelsWritten: number;
  opts: PostSetupOpts | null;
}

// IPC
export interface IPCSmesherStartupData {
  // TODO: Get rid of empty Record when we get rid of mixing erros and data (`normalizeServiceError`)
  config: SmesherConfig | Record<string, never>;
  smesherId: string;
  postSetupState: PostSetupState;
  isSmeshingStarted: boolean;
  numLabelsWritten: number;
  numUnits: number;
}

export interface RewardsInfo {
  total: number;
  lastEpoch: number;
  dailyAverage: number;
  layers: number;
  epochs: number;
}
