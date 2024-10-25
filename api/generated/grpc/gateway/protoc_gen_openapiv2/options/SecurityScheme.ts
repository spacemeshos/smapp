// Original file: vendor/proto/protoc-gen-openapiv2/options/openapiv2.proto

import type { Scopes as _grpc_gateway_protoc_gen_openapiv2_options_Scopes, Scopes__Output as _grpc_gateway_protoc_gen_openapiv2_options_Scopes__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/Scopes';
import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from '../../../../google/protobuf/Value';

// Original file: vendor/proto/protoc-gen-openapiv2/options/openapiv2.proto

export enum _grpc_gateway_protoc_gen_openapiv2_options_SecurityScheme_Flow {
  FLOW_INVALID = 0,
  FLOW_IMPLICIT = 1,
  FLOW_PASSWORD = 2,
  FLOW_APPLICATION = 3,
  FLOW_ACCESS_CODE = 4,
}

// Original file: vendor/proto/protoc-gen-openapiv2/options/openapiv2.proto

export enum _grpc_gateway_protoc_gen_openapiv2_options_SecurityScheme_In {
  IN_INVALID = 0,
  IN_QUERY = 1,
  IN_HEADER = 2,
}

// Original file: vendor/proto/protoc-gen-openapiv2/options/openapiv2.proto

export enum _grpc_gateway_protoc_gen_openapiv2_options_SecurityScheme_Type {
  TYPE_INVALID = 0,
  TYPE_BASIC = 1,
  TYPE_API_KEY = 2,
  TYPE_OAUTH2 = 3,
}

export interface SecurityScheme {
  'type'?: (_grpc_gateway_protoc_gen_openapiv2_options_SecurityScheme_Type | keyof typeof _grpc_gateway_protoc_gen_openapiv2_options_SecurityScheme_Type);
  'description'?: (string);
  'name'?: (string);
  'in'?: (_grpc_gateway_protoc_gen_openapiv2_options_SecurityScheme_In | keyof typeof _grpc_gateway_protoc_gen_openapiv2_options_SecurityScheme_In);
  'flow'?: (_grpc_gateway_protoc_gen_openapiv2_options_SecurityScheme_Flow | keyof typeof _grpc_gateway_protoc_gen_openapiv2_options_SecurityScheme_Flow);
  'authorizationUrl'?: (string);
  'tokenUrl'?: (string);
  'scopes'?: (_grpc_gateway_protoc_gen_openapiv2_options_Scopes | null);
  'extensions'?: ({[key: string]: _google_protobuf_Value});
}

export interface SecurityScheme__Output {
  'type': (_grpc_gateway_protoc_gen_openapiv2_options_SecurityScheme_Type);
  'description': (string);
  'name': (string);
  'in': (_grpc_gateway_protoc_gen_openapiv2_options_SecurityScheme_In);
  'flow': (_grpc_gateway_protoc_gen_openapiv2_options_SecurityScheme_Flow);
  'authorizationUrl': (string);
  'tokenUrl': (string);
  'scopes': (_grpc_gateway_protoc_gen_openapiv2_options_Scopes__Output | null);
  'extensions': ({[key: string]: _google_protobuf_Value__Output});
}
