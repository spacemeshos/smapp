import {
  NodeError,
  NodeStartupState,
  NodeStatus,
  NodeVersionAndBuild,
} from '../../../shared/types';

export const SET_NODE_VERSION_AND_BUILD = 'SET_NODE_VERSION_AND_BUILD';
export const SET_NODE_STATUS = 'SET_NODE_STATUS';
export const SET_NODE_ERROR = 'SET_NODE_ERROR';

export const SET_STARTUP_STATUS = 'SET_STARTUP_STATUS';

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
