import { NodeStatusResponse, NodeVersionAndBuild } from '../../../shared/ipcTypes';

export const SET_NODE_VERSION_AND_BUILD = 'SET_NODE_VERSION_AND_BUILD';
export const SET_NODE_STATUS = 'SET_NODE_STATUS';

export const setNodeStatus = (data: NodeStatusResponse) => ({ type: SET_NODE_STATUS, payload: data });

export const setVersionAndBuild = (payload: NodeVersionAndBuild) => ({ type: SET_NODE_VERSION_AND_BUILD, payload });
