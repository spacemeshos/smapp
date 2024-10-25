// Original file: vendor/proto/protoc-gen-openapiv2/options/openapiv2.proto

import type { Contact as _grpc_gateway_protoc_gen_openapiv2_options_Contact, Contact__Output as _grpc_gateway_protoc_gen_openapiv2_options_Contact__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/Contact';
import type { License as _grpc_gateway_protoc_gen_openapiv2_options_License, License__Output as _grpc_gateway_protoc_gen_openapiv2_options_License__Output } from '../../../../grpc/gateway/protoc_gen_openapiv2/options/License';
import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from '../../../../google/protobuf/Value';

export interface Info {
  'title'?: (string);
  'description'?: (string);
  'termsOfService'?: (string);
  'contact'?: (_grpc_gateway_protoc_gen_openapiv2_options_Contact | null);
  'license'?: (_grpc_gateway_protoc_gen_openapiv2_options_License | null);
  'version'?: (string);
  'extensions'?: ({[key: string]: _google_protobuf_Value});
}

export interface Info__Output {
  'title': (string);
  'description': (string);
  'termsOfService': (string);
  'contact': (_grpc_gateway_protoc_gen_openapiv2_options_Contact__Output | null);
  'license': (_grpc_gateway_protoc_gen_openapiv2_options_License__Output | null);
  'version': (string);
  'extensions': ({[key: string]: _google_protobuf_Value__Output});
}
