// Original file: null

import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import type { VisibilityRule as _google_api_VisibilityRule, VisibilityRule__Output as _google_api_VisibilityRule__Output } from '../../google/api/VisibilityRule';

export interface EnumOptions {
  'allowAlias'?: (boolean);
  'deprecated'?: (boolean);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.google.api.enumVisibility'?: (_google_api_VisibilityRule | null);
}

export interface EnumOptions__Output {
  'allowAlias': (boolean);
  'deprecated': (boolean);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.google.api.enumVisibility': (_google_api_VisibilityRule__Output | null);
}
