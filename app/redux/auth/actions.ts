import { CustomAction } from '../../types';

export const LOGOUT = 'LOGOUT';

export const logout = (): CustomAction => {
  return { type: LOGOUT };
};
