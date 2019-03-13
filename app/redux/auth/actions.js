// @flow
import type { Action } from '/types';

export const SET_AUTHENTICATED: string = 'SET_AUTHENTICATED';
// export const SETUP_FULL_NODE: any = 'SETUP_FULL_NODE';
export const LOGOUT: string = 'LOGOUT';

export const setAuthenticated = (payload: Action = null): Action => ({
  type: SET_AUTHENTICATED,
  payload
});

export const logout = (): Action => ({ type: LOGOUT });
