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
  LOG_LEVEL_FATAL = 7,
}

export interface NodeError {
  level: NodeErrorLevel;
  module: string;
  msg: string;
  stackTrace: string;
}

export interface NodeConfig {
  p2p: {
    'network-id': number;
    [k: string]: any;
  };
  [k: string]: any;
}
