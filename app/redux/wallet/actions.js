// @flow
import { Action } from '/types';

export const LOGOUT: string = 'LOGOUT';

export const logout = (): Action => ({
  type: LOGOUT
});
