// @flow
export const SET_AUTHENTICATED: string = 'SET_AUTHENTICATED';
// export const SETUP_FULL_NODE: any = 'SETUP_FULL_NODE';
export const LOGOUT: string = 'LOGOUT';

export const setAuthenticated = (payload: Object = null) => ({
  type: SET_AUTHENTICATED,
  payload
});

export const logout = () => ({ type: LOGOUT });
