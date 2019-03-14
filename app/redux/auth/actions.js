// @flow
export const SET_AUTHENTICATED: string = 'SET_AUTHENTICATED';

export const setAuthenticated = (payload: any = null) => {
  return {
    type: SET_AUTHENTICATED,
    payload
  };
};
