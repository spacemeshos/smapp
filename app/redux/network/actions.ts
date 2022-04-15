import { eventsService } from '../../infra/eventsService';
import { AppThDispatch } from '../../types';
import slice from './slice';

export const getNetworkDefinitions = () => async (dispatch: AppThDispatch) => {
  const definitions = await eventsService.getNetworkDefinitions();
  dispatch(slice.actions.setNetworkDefinitions(definitions));
};

export const getCurrentLayer = () => async (dispatch: AppThDispatch) => {
  const { currentLayer, error } = await eventsService.getCurrentLayer().catch(() => ({ currentLayer: 0, error: null }));
  if (!error) {
    dispatch(slice.actions.setCurrentLayer(currentLayer));
  }
};

export const getGlobalStateHash = () => async (dispatch: AppThDispatch) => {
  const { rootHash, error } = await eventsService.getGlobalStateHash().catch(() => ({ rootHash: '', error: null }));
  if (!error) {
    dispatch(slice.actions.setStateRootHash(rootHash));
  }
};
