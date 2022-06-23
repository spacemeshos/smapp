import { eventsService } from '../../infra/eventsService';
import { AppThDispatch, GetState } from '../../types';
import { SmeshingOpts } from '../../../shared/types';
import { addErrorPrefix } from '../../infra/utils';
import { getNetworkId } from '../network/selectors';
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
export const DELETED_POS_DATA = 'DELETED_POST_DATA';
export const PAUSED_SMESHING = 'PAUSED_SMESHING';
export const RESUMED_SMESHING = 'RESUMED_SMESHING';
export const SET_POST_DATA_CREATION_STATUS = 'SET_POST_DATA_CREATION_STATUS';
export const SET_ACCOUNT_REWARDS = 'SET_ACCOUNT_REWARDS';

export const startSmeshing = ({
  coinbase,
  dataDir,
  numUnits,
  provider,
  throttle,
}: SmeshingOpts) => async (dispatch: AppThDispatch, getState: GetState) => {
  try {
    const state = getState();
    const curNetId = getNetworkId(state);
    // TODO: Replace hardcoded `numFiles: 1` with something reasonable?
    await eventsService.startSmeshing(
      {
        coinbase,
        dataDir,
        numUnits,
        numFiles: 1,
        computeProviderId: provider,
        throttle,
      },
      curNetId
    );
    localStorage.setItem('smesherInitTimestamp', `${new Date().getTime()}`);
    localStorage.removeItem('smesherSmeshingTimestamp');
    dispatch({
      type: STARTED_SMESHING,
      payload: { coinbase, dataDir, numUnits, provider, throttle },
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
  const res = await eventsService.stopSmeshing({ deleteFiles: true });
  if (res?.error) {
    console.error(res.error); // eslint-disable-line no-console
    return;
  }
  dispatch({ type: DELETED_POS_DATA });
};

export const pauseSmeshing = () => async (dispatch: AppThDispatch) => {
  const res = await eventsService.stopSmeshing({ deleteFiles: false });
  if (res?.error) {
    console.error(res.error); // eslint-disable-line no-console
    return;
  }
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
