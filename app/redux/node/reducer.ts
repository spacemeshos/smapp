import type { NodeState, CustomAction } from '../../types';
import { LOGOUT } from '../auth/actions';
import { SET_NODE_STATUS, SET_NODE_ERROR, SET_NODE_VERSION_AND_BUILD } from './actions';

const initialState = {
  status: null,
  version: '',
  build: '',
  port: '',
  error: 0
};

const reducer = (state: NodeState = initialState, action: CustomAction) => {
  switch (action.type) {
    case SET_NODE_STATUS: {
      const { status } = action.payload;
      return { ...state, status };
    }
    case SET_NODE_ERROR: {
      const { error } = action.payload;
      return { ...state, error };
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
