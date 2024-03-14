import { NodeStartupState } from '../../../shared/types';
import type { NodeState, CustomAction } from '../../types';
import { IPC_BATCH_SYNC, reduceChunkList } from '../ipcBatchSync';
import {
  RESTART_NODE,
  SET_NODE_ERROR,
  SET_NODE_STATUS,
  SET_NODE_VERSION_AND_BUILD,
  SET_STARTUP_STATUS,
  UPDATE_QUICKSYNC_STATUS,
  SET_ATXS_COUNT,
} from './actions';

const initialState: NodeState = {
  quicksyncStatus: null,
  startupStatus: NodeStartupState.Starting,
  status: null,
  version: '',
  build: '',
  port: '',
  error: null,
  dataPath: '',
  isRestarting: false,
  atxsCount: 0,
};

const reducer = (state: NodeState = initialState, action: CustomAction) => {
  switch (action.type) {
    case SET_NODE_STATUS: {
      const status = action.payload;
      return {
        ...state,
        status,
        error: null,
        isRestarting: false,
      };
    }
    case SET_STARTUP_STATUS:
      return { ...state, startupStatus: action.payload };
    case UPDATE_QUICKSYNC_STATUS:
      return { ...state, quicksyncStatus: action.payload };
    case SET_NODE_ERROR: {
      const error = action.payload;
      return {
        ...state,
        error,
        isRestarting: false,
      };
    }
    case SET_NODE_VERSION_AND_BUILD: {
      const {
        payload: { version, build },
      } = action;
      return { ...state, version, build };
    }
    case RESTART_NODE:
      return { ...state, isRestarting: true };
    case SET_ATXS_COUNT:
      return { ...state, atxsCount: action.payload };
    case IPC_BATCH_SYNC:
      return reduceChunkList(['store', 'node'], action.payload, state);
    default:
      return state;
  }
};

export default reducer;
