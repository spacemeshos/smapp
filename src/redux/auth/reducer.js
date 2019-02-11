import * as actions from './actions';

const initialState = {};

type State = {};
type Action = {
  type: string
};

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case actions.SIGN_UP_SUCCESS: {
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
