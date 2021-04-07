import { eventsService } from '../../infra/eventsService';
import { AppThDispatch, Status } from '../../types';

export const SET_NODE_VERSION_AND_BUILD = 'SET_NODE_VERSION_AND_BUILD';
export const SET_NODE_STATUS = 'SET_NODE_STATUS';
export const SET_NODE_ERROR = 'SET_NODE_ERROR';

export const setNodeStatus = ({ status }: { status: Status }) => ({ type: SET_NODE_STATUS, payload: { status } });

export const setNodeError = ({ error }: { error: any }) => ({ type: SET_NODE_ERROR, payload: { error } });

export const getVersionAndBuild = () => async (dispatch: AppThDispatch) => {
  const { version, build } = await eventsService.getVersionAndBuild();
  if (!version || !build) {
    dispatch(getVersionAndBuild());
  } else {
    dispatch({ type: SET_NODE_VERSION_AND_BUILD, payload: { version, build } });
  }
};
