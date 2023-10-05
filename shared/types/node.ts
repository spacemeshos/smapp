import { HexString } from './misc';

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

  // Additional error level that is not represented in
  // GRPC API since it referencing to system errors,
  // that consequences into Node can not run at all
  LOG_LEVEL_SYSERROR = 8,
}

export enum NodeErrorType {
  NOT_SPECIFIED = 0,
  OPEN_CL_NOT_INSTALLED,
  REDIST_NOT_INSTALLED,
  API_NOT_RESPONDING,
  SPAWN,
  LOG_SYSERROR,
  LOG_FATAL,
  LOG_WARN,
  LOST_CONNECTION,
  NODE_NOT_RESPONDING,
  STREAM,
}

export interface NodeError {
  level: NodeErrorLevel;
  module: string;
  msg: string;
  stackTrace: string;
  type: NodeErrorType;
}

export const asNodeError = (nodeError: NodeError): NodeError => nodeError;

export const isNodeError = (e: any): e is NodeError =>
  e &&
  typeof e.level === 'number' &&
  typeof e.module === 'string' &&
  typeof e.msg === 'string' &&
  typeof e.stackTrace === 'string';

export interface NodeConfig {
  api?: {
    'grpc-public-listener': string;
    'grpc-private-listener': string;
    [k: string]: any;
  };
  preset?: string;
  p2p?: {
    bootnodes: Array<string>;
  };
  smeshing?: {
    'smeshing-coinbase'?: HexString;
    'smeshing-start'?: boolean;
    'smeshing-opts'?: {
      'smeshing-opts-datadir': string;
      'smeshing-opts-maxfilesize'?: number;
      'smeshing-opts-numunits'?: number;
      'smeshing-opts-provider'?: number;
    };
    'smeshing-proving-opts'?: {
      'smeshing-opts-proving-nonces'?: number;
      'smeshing-opts-proving-threads'?: number;
    };
  };
  main: {
    'layer-duration': string; // "120s"
    'layers-per-epoch': number;
    'poet-server'?: Array<string>;
    'network-hrp'?: string;
    [k: string]: any;
  };
  genesis: {
    'genesis-time': string;
    'genesis-extra-data': string;
  };
  poet: {
    'phase-shift': string;
    'cycle-gap': string;
    'grace-period': string;
  };
  post: {
    'post-labels-per-unit': number;
    'post-max-numunits': number;
    'post-min-numunits': number;
    'post-k1'?: number;
    'post-k2'?: number;
    'post-k3'?: number;
    'post-k2pow-difficulty'?: bigint | number;
  };
}

export type NodeConfigWithDefinedSmeshing = NodeConfig & {
  smeshing: NodeConfig['smeshing'];
};
