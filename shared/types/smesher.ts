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
  nonces: number;
  threads: number;
}

export enum DeviceType {
  DEVICE_CLASS_UNKNOWN = 0,
  DEVICE_CLASS_CPU = 1,
  DEVICE_CLASS_GPU = 2,
}

export interface PostSetupProvider {
  id: number;
  model: string;
  deviceType: DeviceType;
  performance: number;
}

export interface PostSetupOpts {
  coinbase: string;
  dataDir: string;
  numUnits: number;
  maxFileSize: number;
  provider: number;
  throttle: boolean;
}

export interface PostProvingOpts {
  nonces: number;
  threads: number;
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

export const DEFAULT_POS_MAX_FILE_SIZE = 1024 * 1024 * 1024 * 2; // 2GB

export type BenchmarkRequest = {
  nonces: number;
  threads: number;
};

export type BenchmarkResponse = {
  nonces: number;
  threads: number;
  speed: number;
  maxSize: number;
  maxUnits: number;
};
