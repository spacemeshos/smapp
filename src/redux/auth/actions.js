
export const SIGN_IN_BEGIN = 'AUTH/SIGN_IN_BEGIN';
export const SIGN_IN_SUCCESS = 'AUTH/SIGN_IN_SUCCESS';
export const SIGN_IN_FAILURE = 'AUTH/SIGN_IN_FAILURE';

export const LOGOUT_BEGIN = 'AUTH/LOGOUT_BEGIN';
export const LOGOUT_SUCCESS = 'AUTH/LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'AUTH/LOGOUT_FAILURE';

export const SIGN_UP_BEGIN = 'AUTH/SIGN_UP_BEGIN';
export const SIGN_UP_SUCCESS = 'AUTH/SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'AUTH/SIGN_UP_FAILURE';

export const signIn = () => (dispatch) => {
  dispatch({ type: SIGN_IN_BEGIN });
  try {
    // sign in func calls
    dispatch({ type: SIGN_IN_SUCCESS });
  } catch (e) {
    dispatch({ type: SIGN_IN_FAILURE });
  }
};

export const logOut = () => (dispatch) => {
  dispatch({ type: LOGOUT_BEGIN });
  try {
    // sign in func calls
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (e) {
    dispatch({ type: LOGOUT_FAILURE });
  }
};

export const signUp = () => (dispatch) => {
  dispatch({ type: SIGN_UP_BEGIN });
  try {
    // sign up func calls
    dispatch({ type: SIGN_UP_SUCCESS });
  } catch (e) {
    dispatch({ type: SIGN_UP_FAILURE });
  }
};
