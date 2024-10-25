// Original file: vendor/proto/protoc-gen-openapiv2/options/openapiv2.proto

import type { Info as _grpc_gateway_protoc_gen_openapiv2_options_Info, Info__Output as _grpc_gateway_protoc_gen_openapiv2_options_Info__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/Info';
import type { Scheme as _grpc_gateway_protoc_gen_openapiv2_options_Scheme } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/Scheme';
import type { Response as _grpc_gateway_protoc_gen_openapiv2_options_Response, Response__Output as _grpc_gateway_protoc_gen_openapiv2_options_Response__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/Response';
import type { SecurityDefinitions as _grpc_gateway_protoc_gen_openapiv2_options_SecurityDefinitions, SecurityDefinitions__Output as _grpc_gateway_protoc_gen_openapiv2_options_SecurityDefinitions__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/SecurityDefinitions';
import type { SecurityRequirement as _grpc_gateway_protoc_gen_openapiv2_options_SecurityRequirement, SecurityRequirement__Output as _grpc_gateway_protoc_gen_openapiv2_options_SecurityRequirement__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/SecurityRequirement';
import type { Tag as _grpc_gateway_protoc_gen_openapiv2_options_Tag, Tag__Output as _grpc_gateway_protoc_gen_openapiv2_options_Tag__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/Tag';
import type { ExternalDocumentation as _grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation, ExternalDocumentation__Output as _grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/ExternalDocumentation';
import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from '../../../../google/protobuf/Value';

export interface Swagger {
  'swagger'?: (string);
  'info'?: (_grpc_gateway_protoc_gen_openapiv2_options_Info | null);
  'host'?: (string);
  'basePath'?: (string);
  'schemes'?: (_grpc_gateway_protoc_gen_openapiv2_options_Scheme | keyof typeof _grpc_gateway_protoc_gen_openapiv2_options_Scheme)[];
  'consumes'?: (string)[];
  'produces'?: (string)[];
  'responses'?: ({[key: string]: _grpc_gateway_protoc_gen_openapiv2_options_Response});
  'securityDefinitions'?: (_grpc_gateway_protoc_gen_openapiv2_options_SecurityDefinitions | null);
  'security'?: (_grpc_gateway_protoc_gen_openapiv2_options_SecurityRequirement)[];
  'tags'?: (_grpc_gateway_protoc_gen_openapiv2_options_Tag)[];
  'externalDocs'?: (_grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation | null);
  'extensions'?: ({[key: string]: _google_protobuf_Value});
}

export interface Swagger__Output {
  'swagger': (string);
  'info': (_grpc_gateway_protoc_gen_openapiv2_options_Info__Output | null);
  'host': (string);
  'basePath': (string);
  'schemes': (_grpc_gateway_protoc_gen_openapiv2_options_Scheme)[];
  'consumes': (string)[];
  'produces': (string)[];
  'responses': ({[key: string]: _grpc_gateway_protoc_gen_openapiv2_options_Response__Output});
  'securityDefinitions': (_grpc_gateway_protoc_gen_openapiv2_options_SecurityDefinitions__Output | null);
  'security': (_grpc_gateway_protoc_gen_openapiv2_options_SecurityRequirement__Output)[];
  'tags': (_grpc_gateway_protoc_gen_openapiv2_options_Tag__Output)[];
  'externalDocs': (_grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation__Output | null);
  'extensions': ({[key: string]: _google_protobuf_Value__Output});
}
