import * as actions from './actions';

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SIGN_UP_SUCCESS: {
      const { aa } = action;
      return state;
    }
    case actions.SIGN_IN_SUCCESS: {
      return state;
    }
    default: {
      return state;
    }
  }
};

export default reducer;
