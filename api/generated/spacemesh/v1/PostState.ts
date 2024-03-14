// Original file: vendor/api/spacemesh/v1/post_types.proto


// Original file: vendor/api/spacemesh/v1/post_types.proto

export enum _spacemesh_v1_PostState_State {
  _UNUSED = 0,
  IDLE = 1,
  PROVING = 2,
}

export interface PostState {
  'id'?: (Buffer | Uint8Array | string);
  'state'?: (_spacemesh_v1_PostState_State | keyof typeof _spacemesh_v1_PostState_State);
  'name'?: (string);
}

export interface PostState__Output {
  'id': (Buffer);
  'state': (_spacemesh_v1_PostState_State);
  'name': (string);
}
