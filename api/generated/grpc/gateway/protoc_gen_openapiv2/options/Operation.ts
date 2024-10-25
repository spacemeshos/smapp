// Original file: vendor/proto/protoc-gen-openapiv2/options/openapiv2.proto

import type { ExternalDocumentation as _grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation, ExternalDocumentation__Output as _grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/ExternalDocumentation';
import type { Response as _grpc_gateway_protoc_gen_openapiv2_options_Response, Response__Output as _grpc_gateway_protoc_gen_openapiv2_options_Response__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/Response';
import type { Scheme as _grpc_gateway_protoc_gen_openapiv2_options_Scheme } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/Scheme';
import type { SecurityRequirement as _grpc_gateway_protoc_gen_openapiv2_options_SecurityRequirement, SecurityRequirement__Output as _grpc_gateway_protoc_gen_openapiv2_options_SecurityRequirement__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/SecurityRequirement';
import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from '../../../../google/protobuf/Value';
import type { Parameters as _grpc_gateway_protoc_gen_openapiv2_options_Parameters, Parameters__Output as _grpc_gateway_protoc_gen_openapiv2_options_Parameters__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/Parameters';

export interface Operation {
  'tags'?: (string)[];
  'summary'?: (string);
  'description'?: (string);
  'externalDocs'?: (_grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation | null);
  'operationId'?: (string);
  'consumes'?: (string)[];
  'produces'?: (string)[];
  'responses'?: ({[key: string]: _grpc_gateway_protoc_gen_openapiv2_options_Response});
  'schemes'?: (_grpc_gateway_protoc_gen_openapiv2_options_Scheme | keyof typeof _grpc_gateway_protoc_gen_openapiv2_options_Scheme)[];
  'deprecated'?: (boolean);
  'security'?: (_grpc_gateway_protoc_gen_openapiv2_options_SecurityRequirement)[];
  'extensions'?: ({[key: string]: _google_protobuf_Value});
  'parameters'?: (_grpc_gateway_protoc_gen_openapiv2_options_Parameters | null);
}

export interface Operation__Output {
  'tags': (string)[];
  'summary': (string);
  'description': (string);
  'externalDocs': (_grpc_gateway_protoc_gen_openapiv2_options_ExternalDocumentation__Output | null);
  'operationId': (string);
  'consumes': (string)[];
  'produces': (string)[];
  'responses': ({[key: string]: _grpc_gateway_protoc_gen_openapiv2_options_Response__Output});
  'schemes': (_grpc_gateway_protoc_gen_openapiv2_options_Scheme)[];
  'deprecated': (boolean);
  'security': (_grpc_gateway_protoc_gen_openapiv2_options_SecurityRequirement__Output)[];
  'extensions': ({[key: string]: _google_protobuf_Value__Output});
  'parameters': (_grpc_gateway_protoc_gen_openapiv2_options_Parameters__Output | null);
}
