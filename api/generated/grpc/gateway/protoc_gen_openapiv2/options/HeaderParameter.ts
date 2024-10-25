// Original file: vendor/proto/protoc-gen-openapiv2/options/openapiv2.proto


// Original file: vendor/proto/protoc-gen-openapiv2/options/openapiv2.proto

export enum _grpc_gateway_protoc_gen_openapiv2_options_HeaderParameter_Type {
  UNKNOWN = 0,
  STRING = 1,
  NUMBER = 2,
  INTEGER = 3,
  BOOLEAN = 4,
}

export interface HeaderParameter {
  'name'?: (string);
  'description'?: (string);
  'type'?: (_grpc_gateway_protoc_gen_openapiv2_options_HeaderParameter_Type | keyof typeof _grpc_gateway_protoc_gen_openapiv2_options_HeaderParameter_Type);
  'format'?: (string);
  'required'?: (boolean);
}

export interface HeaderParameter__Output {
  'name': (string);
  'description': (string);
  'type': (_grpc_gateway_protoc_gen_openapiv2_options_HeaderParameter_Type);
  'format': (string);
  'required': (boolean);
}
