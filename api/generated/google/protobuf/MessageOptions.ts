// Original file: null

import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import type { Schema as _grpc_gateway_protoc_gen_openapiv2_options_Schema, Schema__Output as _grpc_gateway_protoc_gen_openapiv2_options_Schema__Output } from '../../grpc/gateway/protoc_gen_openapiv2/options/Schema';
import type { VisibilityRule as _google_api_VisibilityRule, VisibilityRule__Output as _google_api_VisibilityRule__Output } from '../../google/api/VisibilityRule';

export interface MessageOptions {
  'messageSetWireFormat'?: (boolean);
  'noStandardDescriptorAccessor'?: (boolean);
  'deprecated'?: (boolean);
  'mapEntry'?: (boolean);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.grpc.gateway.protoc_gen_openapiv2.options.openapiv2Schema'?: (_grpc_gateway_protoc_gen_openapiv2_options_Schema | null);
  '.google.api.messageVisibility'?: (_google_api_VisibilityRule | null);
}

export interface MessageOptions__Output {
  'messageSetWireFormat': (boolean);
  'noStandardDescriptorAccessor': (boolean);
  'deprecated': (boolean);
  'mapEntry': (boolean);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.grpc.gateway.protoc_gen_openapiv2.options.openapiv2Schema': (_grpc_gateway_protoc_gen_openapiv2_options_Schema__Output | null);
  '.google.api.messageVisibility': (_google_api_VisibilityRule__Output | null);
}
