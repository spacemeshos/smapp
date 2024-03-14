// Original file: vendor/api/spacemesh/v1/debug_types.proto


// Original file: vendor/api/spacemesh/v1/debug_types.proto

export enum _spacemesh_v1_NetworkInfoResponse_NATType {
  NATTypeUnknown = 0,
  Cone = 1,
  Symmetric = 2,
}

// Original file: vendor/api/spacemesh/v1/debug_types.proto

export enum _spacemesh_v1_NetworkInfoResponse_Reachability {
  ReachabilityUnknown = 0,
  Public = 1,
  Private = 2,
}

export interface NetworkInfoResponse {
  'id'?: (string);
  'listenAddresses'?: (string)[];
  'knownAddresses'?: (string)[];
  'natTypeUdp'?: (_spacemesh_v1_NetworkInfoResponse_NATType | keyof typeof _spacemesh_v1_NetworkInfoResponse_NATType);
  'natTypeTcp'?: (_spacemesh_v1_NetworkInfoResponse_NATType | keyof typeof _spacemesh_v1_NetworkInfoResponse_NATType);
  'reachability'?: (_spacemesh_v1_NetworkInfoResponse_Reachability | keyof typeof _spacemesh_v1_NetworkInfoResponse_Reachability);
  'dhtServerEnabled'?: (boolean);
}

export interface NetworkInfoResponse__Output {
  'id': (string);
  'listenAddresses': (string)[];
  'knownAddresses': (string)[];
  'natTypeUdp': (_spacemesh_v1_NetworkInfoResponse_NATType);
  'natTypeTcp': (_spacemesh_v1_NetworkInfoResponse_NATType);
  'reachability': (_spacemesh_v1_NetworkInfoResponse_Reachability);
  'dhtServerEnabled': (boolean);
}
