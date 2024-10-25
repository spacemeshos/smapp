// Original file: vendor/proto/protoc-gen-openapiv2/options/openapiv2.proto

import type { ExternalDocumentation as _grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation, ExternalDocumentation__Output as _grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/ExternalDocumentation';
import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from '../../../../google/protobuf/Value';

export interface Tag {
  'name'?: (string);
  'description'?: (string);
  'externalDocs'?: (_grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation | null);
  'extensions'?: ({[key: string]: _google_protobuf_Value});
}

export interface Tag__Output {
  'name': (string);
  'description': (string);
  'externalDocs': (_grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation__Output | null);
  'extensions': ({[key: string]: _google_protobuf_Value__Output});
}
