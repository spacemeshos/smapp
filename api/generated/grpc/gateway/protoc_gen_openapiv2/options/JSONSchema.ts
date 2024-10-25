// Original file: vendor/proto/protoc-gen-openapiv2/options/openapiv2.proto

import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from '../../../../google/protobuf/Value';
import type { Long } from '@grpc/proto-loader';

export interface _grpc_gateway_protoc_gen_openapiv2_options_JSONSchema_FieldConfiguration {
  'pathParamName'?: (string);
}

export interface _grpc_gateway_protoc_gen_openapiv2_options_JSONSchema_FieldConfiguration__Output {
  'pathParamName': (string);
}

// Original file: vendor/proto/protoc-gen-openapiv2/options/openapiv2.proto

export enum _grpc_gateway_protoc_gen_openapiv2_options_JSONSchema_JSONSchemaSimpleTypes {
  UNKNOWN = 0,
  ARRAY = 1,
  BOOLEAN = 2,
  INTEGER = 3,
  NULL = 4,
  NUMBER = 5,
  OBJECT = 6,
  STRING = 7,
}

export interface JSONSchema {
  'ref'?: (string);
  'title'?: (string);
  'description'?: (string);
  'default'?: (string);
  'readOnly'?: (boolean);
  'example'?: (string);
  'multipleOf'?: (number | string);
  'maximum'?: (number | string);
  'exclusiveMaximum'?: (boolean);
  'minimum'?: (number | string);
  'exclusiveMinimum'?: (boolean);
  'maxLength'?: (number | string | Long);
  'minLength'?: (number | string | Long);
  'pattern'?: (string);
  'maxItems'?: (number | string | Long);
  'minItems'?: (number | string | Long);
  'uniqueItems'?: (boolean);
  'maxProperties'?: (number | string | Long);
  'minProperties'?: (number | string | Long);
  'required'?: (string)[];
  'array'?: (string)[];
  'type'?: (_grpc_gateway_protoc_gen_openapiv2_options_JSONSchema_JSONSchemaSimpleTypes | keyof typeof _grpc_gateway_protoc_gen_openapiv2_options_JSONSchema_JSONSchemaSimpleTypes)[];
  'format'?: (string);
  'enum'?: (string)[];
  'extensions'?: ({[key: string]: _google_protobuf_Value});
  'fieldConfiguration'?: (_grpc_gateway_protoc_gen_openapiv2_options_JSONSchema_FieldConfiguration | null);
}

export interface JSONSchema__Output {
  'ref': (string);
  'title': (string);
  'description': (string);
  'default': (string);
  'readOnly': (boolean);
  'example': (string);
  'multipleOf': (number);
  'maximum': (number);
  'exclusiveMaximum': (boolean);
  'minimum': (number);
  'exclusiveMinimum': (boolean);
  'maxLength': (Long);
  'minLength': (Long);
  'pattern': (string);
  'maxItems': (Long);
  'minItems': (Long);
  'uniqueItems': (boolean);
  'maxProperties': (Long);
  'minProperties': (Long);
  'required': (string)[];
  'array': (string)[];
  'type': (_grpc_gateway_protoc_gen_openapiv2_options_JSONSchema_JSONSchemaSimpleTypes)[];
  'format': (string);
  'enum': (string)[];
  'extensions': ({[key: string]: _google_protobuf_Value__Output});
  'fieldConfiguration': (_grpc_gateway_protoc_gen_openapiv2_options_JSONSchema_FieldConfiguration__Output | null);
}
