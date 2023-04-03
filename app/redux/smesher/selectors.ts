import { PostSetupState, SmeshingOpts } from '../../../shared/types';
import { RootState } from '../../types';

export const getPostSetupState = (state: RootState) =>
  state.smesher.postSetupState;

export const isCreatingPostData = (state: RootState) =>
  getPostSetupState(state) === PostSetupState.STATE_IN_PROGRESS;

export const getSmeshingOpts = (state: RootState) => {
  const {
    smesher: { coinbase, dataDir, numUnits, throttle, provider, maxFileSize },
  } = state;
  return { coinbase, dataDir, numUnits, throttle, provider, maxFileSize };
};

export const isValidSmeshingOpts = (
  opts: ReturnType<typeof getSmeshingOpts>
): opts is SmeshingOpts => {
  const { coinbase, dataDir, numUnits, provider } = opts;
  return !!(coinbase && dataDir && numUnits && provider !== null);
};

export const isErrorState = (state: RootState) =>
  isValidSmeshingOpts(getSmeshingOpts(state)) &&
  getPostSetupState(state) === PostSetupState.STATE_ERROR;

export const isSmeshingPaused = (state: RootState) => {
  const isPausedState =
    getPostSetupState(state) === PostSetupState.STATE_PAUSED;
  const opts = getSmeshingOpts(state);
  return (
    (isPausedState || !state.smesher.isSmeshingStarted) &&
    isValidSmeshingOpts(opts)
  );
};

export const isSmeshing = (state: RootState) =>
  state.smesher.isSmeshingStarted &&
  (getPostSetupState(state) === PostSetupState.STATE_COMPLETE ||
    // Until Node will sync enough GRPC API returns NOT STARTED state
    // even if we already started smeshing (so PoS will be created soon)
    (getPostSetupState(state) === PostSetupState.STATE_NOT_STARTED &&
      isValidSmeshingOpts(getSmeshingOpts(state))));
