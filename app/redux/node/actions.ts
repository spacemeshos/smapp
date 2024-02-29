import {
  NodeError,
  NodeStartupState,
  NodeStatus,
  NodeVersionAndBuild,
} from '../../../shared/types';
import { QuicksyncStatus } from '../../../shared/types/quicksync';
import { eventsService } from '../../infra/eventsService';
import { AppThDispatch } from '../../types';

export const SET_NODE_VERSION_AND_BUILD = 'SET_NODE_VERSION_AND_BUILD';
export const SET_NODE_STATUS = 'SET_NODE_STATUS';
export const SET_NODE_ERROR = 'SET_NODE_ERROR';

export const SET_STARTUP_STATUS = 'SET_STARTUP_STATUS';
export const RESTART_NODE = 'RESTART_NODE';

export const UPDATE_QUICKSYNC_STATUS = 'UPDATE_QUICKSYNC_STATUS';

export const SET_ATXS_COUNT = 'SET_ATXS_COUNT';

export const setNodeStatus = (status: NodeStatus) => ({
  type: SET_NODE_STATUS,
  payload: status,
});
export const setNodeError = (error: NodeError) => ({
  type: SET_NODE_ERROR,
  payload: error,
});

export const setVersionAndBuild = (payload: NodeVersionAndBuild) => ({
  type: SET_NODE_VERSION_AND_BUILD,
  payload,
});

export const setNodeStartupStatus = (payload: NodeStartupState) => ({
  type: SET_STARTUP_STATUS,
  payload,
});

export const restartNode = () => (dispatch: AppThDispatch) => {
  dispatch({ type: 'RESTART_NODE' });
  eventsService.restartNode();
};

export const updateQuicksyncStatus = (status: QuicksyncStatus) => ({
  type: UPDATE_QUICKSYNC_STATUS,
  payload: status,
});

export const setAtxsCount = (amount: number) => ({
  type: SET_ATXS_COUNT,
  payload: amount,
});
