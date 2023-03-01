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
  maxFileSize: number;
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
  maxFileSize: number;
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
  maxFileSize: number;
}

export interface RewardsInfo {
  total: number;
  lastEpoch: number;
  dailyAverage: number;
  layers: number;
  epochs: number;
}

export const DEFAULT_POS_MAX_FILE_SIZE_GB = 2;
export const DEFAULT_POS_MAX_FILE_SIZE_LIMIT_GB = 100;
export const DEFAULT_POS_MAX_FILE_SIZE = 1024 * 1024 * 1024 * 2; // 2GB
export const DEFAULT_POS_MAX_FILE_SIZE_LIMIT = 1024 * 1024 * 1024 * 100; // 100GB
