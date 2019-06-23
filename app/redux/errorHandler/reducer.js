// @flow
import type { Action } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import { SET_GRPC_ERROR } from './actions';

const initialState = {
  grpcError: null
};

const reducer = (state: any = initialState, action: Action) => {
  switch (action.type) {
    case SET_GRPC_ERROR: {
      const {
        payload: { grpcError }
      } = action;
      return { ...state, grpcError };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
