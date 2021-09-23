import { eventsService } from '../../infra/eventsService';
import { AppThDispatch } from '../../types';
import { setNodeError } from '../node/actions';

export const SET_NETWORK_DEFINITIONS = 'SET_NETWORK_DEFINITIONS';
export const SET_CURRENT_LAYER = 'SET_CURRENT_LAYER';
export const SET_STATE_ROOT_HASH = 'SET_STATE_ROOT_HASH';
export const SET_REMOTE_API = 'SET_REMOTE_API';

export const getNetworkDefinitions = () => async (dispatch: AppThDispatch) => {
  const definitions = await eventsService.getNetworkDefinitions();
  dispatch({ type: SET_NETWORK_DEFINITIONS, payload: { definitions } });
};

export const getCurrentLayer = () => async (dispatch: AppThDispatch) => {
  const { currentLayer, error } = await eventsService.getCurrentLayer();
  if (error) {
    dispatch(setNodeError(error));
  } else {
    dispatch({ type: SET_CURRENT_LAYER, payload: { currentLayer } });
  }
};

export const getGlobalStateHash = () => async (dispatch: AppThDispatch) => {
  const { rootHash, error } = await eventsService.getGlobalStateHash();
  if (error) {
    dispatch(setNodeError(error));
  } else {
    dispatch({ type: SET_STATE_ROOT_HASH, payload: { rootHash } });
  }
};

export const setRemoteApi = (remoteApi: string | null) => ({
  type: SET_REMOTE_API,
  payload: { remoteApi }
});
