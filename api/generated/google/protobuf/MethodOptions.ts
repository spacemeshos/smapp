// Original file: null

import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import type { Operation as _grpc_gateway_protoc_gen_openapiv2_options_Operation, Operation__Output as _grpc_gateway_protoc_gen_openapiv2_options_Operation__Output } from '../../grpc/gateway/protoc_gen_openapiv2/options/Operation';
import type { VisibilityRule as _google_api_VisibilityRule, VisibilityRule__Output as _google_api_VisibilityRule__Output } from '../../google/api/VisibilityRule';
import type { HttpRule as _google_api_HttpRule, HttpRule__Output as _google_api_HttpRule__Output } from '../../google/api/HttpRule';

export interface MethodOptions {
  'deprecated'?: (boolean);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.grpc.gateway.protoc_gen_openapiv2.options.openapiv2Operation'?: (_grpc_gateway_protoc_gen_openapiv2_options_Operation | null);
  '.google.api.methodVisibility'?: (_google_api_VisibilityRule | null);
  '.google.api.http'?: (_google_api_HttpRule | null);
}

export interface MethodOptions__Output {
  'deprecated': (boolean);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.grpc.gateway.protoc_gen_openapiv2.options.openapiv2Operation': (_grpc_gateway_protoc_gen_openapiv2_options_Operation__Output | null);
  '.google.api.methodVisibility': (_google_api_VisibilityRule__Output | null);
  '.google.api.http': (_google_api_HttpRule__Output | null);
}
