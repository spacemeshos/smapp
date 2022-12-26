import { PostSetupState, SmeshingOpts } from '../../../shared/types';
import { RootState } from '../../types';

export const getPostSetupState = (state: RootState) =>
  state.smesher.postSetupState;

export const isSmeshing = (state: RootState) =>
  getPostSetupState(state) === PostSetupState.STATE_COMPLETE;
export const isCreatingPostData = (state: RootState) =>
  getPostSetupState(state) === PostSetupState.STATE_IN_PROGRESS;

export const isErrorState = (state: RootState) =>
  getPostSetupState(state) === PostSetupState.STATE_ERROR;

export const getSmeshingOpts = (state: RootState) => {
  const {
    smesher: { coinbase, dataDir, numUnits, throttle, provider },
  } = state;
  return { coinbase, dataDir, numUnits, throttle, provider };
};

export const isValidSmeshingOpts = (
  opts: ReturnType<typeof getSmeshingOpts>
): opts is SmeshingOpts => {
  const { coinbase, dataDir, numUnits, provider } = opts;
  return !!(coinbase && dataDir && numUnits && provider !== null);
};

export const isSmeshingPaused = (state: RootState) => {
  const isNotStarted = getPostSetupState(state) === PostSetupState.STATE_PAUSED;
  const opts = getSmeshingOpts(state);
  return isNotStarted && isValidSmeshingOpts(opts);
};
