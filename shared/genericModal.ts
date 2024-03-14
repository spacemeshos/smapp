import { PickOptionalPropsOf } from './types/utils';

export interface GenericButtonOpts {
  label: string;
  action: string | 'close';
  primary?: boolean;
}

export interface GenericModalOpts {
  title: string;
  message: string;
  buttons?: GenericButtonOpts[];
}

export const GENERIC_MODAL_DEFAULTS: Required<
  PickOptionalPropsOf<GenericModalOpts>
> = {
  buttons: [{ label: 'DISMISS', action: 'close' }],
};
