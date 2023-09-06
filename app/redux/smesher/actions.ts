import { eventsService } from '../../infra/eventsService';
import { AppThDispatch, GetState } from '../../types';
import { SmeshingOpts } from '../../../shared/types';
import { addErrorPrefix } from '../../infra/utils';
import { setUiError } from '../ui/actions';
import {
  getSmeshingOpts,
  isSmeshingPaused,
  isValidSmeshingOpts,
} from './selectors';

export const SET_SMESHER_SETTINGS_AND_STARTUP_STATUS =
  'SET_SMESHER_SETTINGS_AND_STARTUP_STATUS';
export const SET_SETUP_COMPUTE_PROVIDERS = 'SET_SETUP_COMPUTE_PROVIDERS';
export const SET_SMESHER_CONFIG = 'SET_SMESHER_CONFIG';
export const STARTED_SMESHING = 'STARTED_SMESHING';
export const NODE_RESTARTED = 'NODE_RESTARTED';
export const DELETED_POS_DATA = 'DELETED_POST_DATA';
export const PAUSED_SMESHING = 'PAUSED_SMESHING';
export const RESUMED_SMESHING = 'RESUMED_SMESHING';
export const SET_POST_DATA_CREATION_STATUS = 'SET_POST_DATA_CREATION_STATUS';
export const SET_ACCOUNT_REWARDS = 'SET_ACCOUNT_REWARDS';
export const SET_METADATA = 'SET_METADATA';

export const startSmeshing = ({
  coinbase,
  dataDir,
  numUnits,
  provider,
  throttle,
  maxFileSize,
  nonces,
  threads,
}: SmeshingOpts) => async (dispatch: AppThDispatch): Promise<boolean> => {
  try {
    await eventsService.startSmeshing([
      {
        coinbase,
        dataDir,
        numUnits,
        maxFileSize,
        provider,
        throttle,
      },
      { nonces, threads },
    ]);
    dispatch({
      type: STARTED_SMESHING,
      payload: {
        coinbase,
        dataDir,
        numUnits,
        provider,
        throttle,
        maxFileSize,
        nonces,
        threads,
      },
    });
    return true;
  } catch (error) {
    dispatch(
      setUiError(addErrorPrefix('Error initiating smeshing\n', error as Error))
    );
    return false;
  }
};

export const deletePosData = () => async (dispatch: AppThDispatch) => {
  await eventsService.stopSmeshing({ deleteFiles: true });
  dispatch({ type: DELETED_POS_DATA });
};

export const pauseSmeshing = () => async (dispatch: AppThDispatch) => {
  await eventsService.stopSmeshing({ deleteFiles: false });
  dispatch({ type: PAUSED_SMESHING });
};

export const resumeSmeshing = () => async (
  dispatch: AppThDispatch,
  getState: GetState
) => {
  const state = getState();
  const isPaused = isSmeshingPaused(state);
  const smeshingOpts = getSmeshingOpts(state);
  return isPaused && isValidSmeshingOpts(smeshingOpts)
    ? dispatch(startSmeshing(smeshingOpts))
    : false;
};

export const nodeRestarted = () => ({
  type: NODE_RESTARTED,
  payload: {},
});
