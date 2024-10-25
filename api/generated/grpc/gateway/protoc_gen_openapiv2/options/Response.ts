// Original file: vendor/proto/protoc-gen-openapiv2/options/openapiv2.proto

import type { Schema as _grpc_gateway_protoc_gen_openapiv2_options_Schema, Schema__Output as _grpc_gateway_protoc_gen_openapiv2_options_Schema__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/Schema';
import type { Header as _grpc_gateway_protoc_gen_openapiv2_options_Header, Header__Output as _grpc_gateway_protoc_gen_openapiv2_options_Header__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/Header';
import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from '../../../../google/protobuf/Value';

export interface Response {
  'description'?: (string);
  'schema'?: (_grpc_gateway_protoc_gen_openapiv2_options_Schema | null);
  'headers'?: ({[key: string]: _grpc_gateway_protoc_gen_openapiv2_options_Header});
  'examples'?: ({[key: string]: string});
  'extensions'?: ({[key: string]: _google_protobuf_Value});
}

export interface Response__Output {
  'description': (string);
  'schema': (_grpc_gateway_protoc_gen_openapiv2_options_Schema__Output | null);
  'headers': ({[key: string]: _grpc_gateway_protoc_gen_openapiv2_options_Header__Output});
  'examples': ({[key: string]: string});
  'extensions': ({[key: string]: _google_protobuf_Value__Output});
}
