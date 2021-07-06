import { eventsService } from '../../infra/eventsService';
import { AppThDispatch } from '../../types';

export const SET_NETWORK_DEFINITIONS = 'SET_NETWORK_DEFINITIONS';
export const SET_CURRENT_LAYER = 'SET_CURRENT_LAYER';
export const SET_STATE_ROOT_HASH = 'SET_STATE_ROOT_HASH';

export const getNetworkDefinitions = () => async (dispatch: AppThDispatch) => {
  const definitions = await eventsService.getNetworkDefinitions();
  dispatch({ type: SET_NETWORK_DEFINITIONS, payload: { definitions } });
};

export const getCurrentLayer = () => async (dispatch: AppThDispatch) => {
  const { layer } = await eventsService.getGlobalStateHash();
  dispatch({ type: SET_CURRENT_LAYER, payload: { layer } });
};

export const getGlobalStateHash = () => async (dispatch: AppThDispatch) => {
  const { layer, rootHash } = await eventsService.getGlobalStateHash();
  dispatch({ type: SET_STATE_ROOT_HASH, payload: { layer, rootHash } });
};
