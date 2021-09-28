// Original file: proto/node_types.proto

import type { LogLevel as _spacemesh_v1_LogLevel } from '../../spacemesh/v1/LogLevel';

export interface NodeError {
  'level'?: (_spacemesh_v1_LogLevel | keyof typeof _spacemesh_v1_LogLevel);
  'module'?: (string);
  'msg'?: (string);
  'stackTrace'?: (string);
}

export interface NodeError__Output {
  'level': (_spacemesh_v1_LogLevel);
  'module': (string);
  'msg': (string);
  'stackTrace': (string);
}
