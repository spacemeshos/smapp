// Original file: vendor/proto/protoc-gen-openapiv2/options/openapiv2.proto

import type { JSONSchema as _grpc_gateway_protoc_gen_openapiv2_options_JSONSchema, JSONSchema__Output as _grpc_gateway_protoc_gen_openapiv2_options_JSONSchema__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/JSONSchema';
import type { ExternalDocumentation as _grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation, ExternalDocumentation__Output as _grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/ExternalDocumentation';

export interface Schema {
  'jsonSchema'?: (_grpc_gateway_protoc_gen_openapiv2_options_JSONSchema | null);
  'discriminator'?: (string);
  'readOnly'?: (boolean);
  'externalDocs'?: (_grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation | null);
  'example'?: (string);
}

export interface Schema__Output {
  'jsonSchema': (_grpc_gateway_protoc_gen_openapiv2_options_JSONSchema__Output | null);
  'discriminator': (string);
  'readOnly': (boolean);
  'externalDocs': (_grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation__Output | null);
  'example': (string);
}
