// Original file: null

import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import type { JSONSchema as _grpc_gateway_protoc_gen_openapiv2_options_JSONSchema, JSONSchema__Output as _grpc_gateway_protoc_gen_openapiv2_options_JSONSchema__Output } from '../../grpc/gateway/protoc_gen_openapiv2/options/JSONSchema';
import type { VisibilityRule as _google_api_VisibilityRule, VisibilityRule__Output as _google_api_VisibilityRule__Output } from '../../google/api/VisibilityRule';

// Original file: null

export enum _google_protobuf_FieldOptions_CType {
  STRING = 0,
  CORD = 1,
  STRING_PIECE = 2,
}

// Original file: null

export enum _google_protobuf_FieldOptions_JSType {
  JS_NORMAL = 0,
  JS_STRING = 1,
  JS_NUMBER = 2,
}

export interface FieldOptions {
  'ctype'?: (_google_protobuf_FieldOptions_CType | keyof typeof _google_protobuf_FieldOptions_CType);
  'packed'?: (boolean);
  'deprecated'?: (boolean);
  'lazy'?: (boolean);
  'jstype'?: (_google_protobuf_FieldOptions_JSType | keyof typeof _google_protobuf_FieldOptions_JSType);
  'weak'?: (boolean);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.grpc.gateway.protoc_gen_openapiv2.options.openapiv2Field'?: (_grpc_gateway_protoc_gen_openapiv2_options_JSONSchema | null);
  '.google.api.fieldVisibility'?: (_google_api_VisibilityRule | null);
}

export interface FieldOptions__Output {
  'ctype': (_google_protobuf_FieldOptions_CType);
  'packed': (boolean);
  'deprecated': (boolean);
  'lazy': (boolean);
  'jstype': (_google_protobuf_FieldOptions_JSType);
  'weak': (boolean);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.grpc.gateway.protoc_gen_openapiv2.options.openapiv2Field': (_grpc_gateway_protoc_gen_openapiv2_options_JSONSchema__Output | null);
  '.google.api.fieldVisibility': (_google_api_VisibilityRule__Output | null);
}
