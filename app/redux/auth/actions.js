// @flow
export const SET_AUTHENTICATED: string = 'SET_AUTHENTICATED';
// export const SETUP_FULL_NODE: any = 'SETUP_FULL_NODE';

export const setAuthenticated = (payload: any = null) => {
  return {
    type: SET_AUTHENTICATED,
    payload
  };
};
