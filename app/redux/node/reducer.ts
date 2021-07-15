import type { NodeState, CustomAction } from '../../types';
import { LOGOUT } from '../auth/actions';
import { SET_NODE_STATUS, SET_NODE_VERSION_AND_BUILD } from './actions';

const initialState = {
  status: null,
  version: '',
  build: '',
  port: '',
  errors: []
};

const reducer = (state: NodeState = initialState, action: CustomAction) => {
  switch (action.type) {
    case SET_NODE_STATUS: {
      const { status, error } = action.payload;
      const errors = error ? [...state.errors, error] : state.errors;
      const newErrorsState = status ? [] : errors;
      return {
        ...state,
        status: status || state.status,
        errors: newErrorsState
      };
    }
    case SET_NODE_VERSION_AND_BUILD: {
      const {
        payload: { version, build }
      } = action;
      return { ...state, version, build };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
