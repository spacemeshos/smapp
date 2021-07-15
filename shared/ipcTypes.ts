import { NodeError, NodeStatus } from './types';

export interface NodeVersionAndBuild {
  version: string;
  build: string;
}

export interface NodeStatusResponse {
  status?: NodeStatus;
  error?: NodeError;
  grpcError?: any;
}
