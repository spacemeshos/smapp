import { Event } from '../../api/generated/spacemesh/v1/Event';
import { EventAtxPubished } from '../../api/generated/spacemesh/v1/EventAtxPubished';
import { EventPoetWaitProof } from '../../api/generated/spacemesh/v1/EventPoetWaitProof';
import { EventPoetWaitRound } from '../../api/generated/spacemesh/v1/EventPoetWaitRound';
import { _spacemesh_v1_PostSetupStatus_State as PostSetupState } from '../../api/generated/spacemesh/v1/PostSetupStatus';

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
  smesherIds: string[];
  postSetupState: PostSetupState;
  isSmeshingStarted: boolean;
  numLabelsWritten: number;
  numUnits: number;
  maxFileSize: number;
}

export interface RewardsInfo {
  total: number;
  layers: number;
  epochs: number;
  lastLayer: number;
  lastEpoch: number;
  lastEpochRewards: number;
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

export type BenchmarkErrorResult = {
  nonces: number;
  threads: number;
  error: string;
};

type PatchWait<T> = Omit<T, 'wait'> & { wait: number };
type PatchWaitDeep<T> = T extends Event
  ? Omit<Omit<Omit<T, 'atxPublished'>, 'poetWaitProof'>, 'poetWaitRound'> & {
      poetWaitRound?: PatchWait<EventPoetWaitRound> | null;
    } & { poetWaitProof?: PatchWait<EventPoetWaitProof> | null } & {
      atxPublished?: PatchWait<EventAtxPubished> | null;
    }
  : T;

export type NodeEvent = Omit<PatchWaitDeep<Event>, 'timestamp'> & {
  timestamp: number;
};
