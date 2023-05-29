import type { NodeState, CustomAction } from '../../types';
import { LOGOUT } from '../auth/actions';
import { IPC_SYNC_TYPE, isMySyncChannel } from '../ipcSync';
import {
  SET_NODE_ERROR,
  SET_NODE_STATUS,
  SET_NODE_VERSION_AND_BUILD,
} from './actions';

const initialState = {
  status: null,
  version: '',
  build: '',
  port: '',
  error: null,
  dataPath: '',
};

const reducer = (state: NodeState = initialState, action: CustomAction) => {
  switch (action.type) {
    case SET_NODE_STATUS: {
      const status = action.payload;
      return {
        ...state,
        status,
        error: null,
      };
    }
    case SET_NODE_ERROR: {
      const error = action.payload;
      return { ...state, error };
    }
    case SET_NODE_VERSION_AND_BUILD: {
      const {
        payload: { version, build },
      } = action;
      return { ...state, version, build };
    }
    case LOGOUT:
      return initialState;
    case IPC_SYNC_TYPE: {
      if (!isMySyncChannel('config', action)) return state;
      const { payload } = action;
      return {
        ...state,
        dataPath: payload.node.dataPath,
        port: payload.node.port,
      };
    }
    default:
      return state;
  }
};

export default reducer;
