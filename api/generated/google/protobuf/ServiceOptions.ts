// Original file: null

import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import type { Tag as _grpc_gateway_protoc_gen_openapiv2_options_Tag, Tag__Output as _grpc_gateway_protoc_gen_openapiv2_options_Tag__Output } from '../../grpc/gateway/protoc_gen_openapiv2/options/Tag';
import type { VisibilityRule as _google_api_VisibilityRule, VisibilityRule__Output as _google_api_VisibilityRule__Output } from '../../google/api/VisibilityRule';

export interface ServiceOptions {
  'deprecated'?: (boolean);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.grpc.gateway.protoc_gen_openapiv2.options.openapiv2Tag'?: (_grpc_gateway_protoc_gen_openapiv2_options_Tag | null);
  '.google.api.apiVisibility'?: (_google_api_VisibilityRule | null);
}

export interface ServiceOptions__Output {
  'deprecated': (boolean);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.grpc.gateway.protoc_gen_openapiv2.options.openapiv2Tag': (_grpc_gateway_protoc_gen_openapiv2_options_Tag__Output | null);
  '.google.api.apiVisibility': (_google_api_VisibilityRule__Output | null);
}
