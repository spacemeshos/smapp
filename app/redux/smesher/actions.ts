import { eventsService } from '../../infra/eventsService';
import { AppThDispatch } from '../../types';
import { PostSetupComputeProvider } from '../../../shared/types';
import { addErrorPrefix } from '../../infra/utils';
import { setUiError } from '../ui/actions';

export const SET_SMESHER_SETTINGS_AND_STARTUP_STATUS = 'SET_SMESHER_SETTINGS_AND_STARTUP_STATUS';
export const SET_SETUP_COMPUTE_PROVIDERS = 'SET_SETUP_COMPUTE_PROVIDERS';
export const SET_SMESHER_CONFIG = 'SET_SMESHER_CONFIG';
export const STARTED_SMESHING = 'STARTED_SMESHING';
export const DELETED_POS_DATA = 'DELETED_POST_DATA';
export const SET_POST_DATA_CREATION_STATUS = 'SET_POST_DATA_CREATION_STATUS';
export const SET_ACCOUNT_REWARDS = 'SET_ACCOUNT_REWARDS';

export const startSmeshing = ({
  coinbase,
  dataDir,
  numUnits,
  provider,
  throttle
}: {
  coinbase: string;
  dataDir: string;
  numUnits: number;
  provider: PostSetupComputeProvider;
  throttle: boolean;
}) => async (dispatch: AppThDispatch) => {
  try {
    // TODO: Replace hardcoded `numFiles: 1` with something reasonable?
    await eventsService.startSmeshing({ coinbase, dataDir, numUnits, numFiles: 1, computeProviderId: provider.id, throttle });
    localStorage.setItem('smesherInitTimestamp', `${new Date().getTime()}`);
    localStorage.removeItem('smesherSmeshingTimestamp');
    dispatch({ type: STARTED_SMESHING, payload: { coinbase, dataDir, numUnits, provider, throttle } });
    return true;
  } catch (error) {
    dispatch(setUiError(addErrorPrefix('Error initiating smeshing\n', error as Error)));
    return false;
  }
};

export const deletePosData = ({ deleteFiles }) => async (dispatch: AppThDispatch) => {
  const { error } = await eventsService.stopSmeshing({ deleteFiles });
  if (error) {
    console.error(error); // eslint-disable-line no-console
  } else {
    dispatch({ type: DELETED_POS_DATA });
  }
};
