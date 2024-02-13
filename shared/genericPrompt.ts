import { PickOptionalPropsOf } from './types/utils';

export interface GenericPromptOpts {
  title: string;
  message: string;
  confirmTitle?: string;
  cancelTitle?: string;
  cancelTimeout?: number | null;
}

export const GENERIC_PROMPT_DEFAULTS: Required<
  PickOptionalPropsOf<GenericPromptOpts>
> = {
  confirmTitle: 'Confirm',
  cancelTitle: 'Cancel',
  cancelTimeout: null,
};
