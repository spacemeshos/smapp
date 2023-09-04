import { PostSetupState, SmeshingOpts } from '../../../shared/types';
import { RootState } from '../../types';

export const getPostSetupState = (state: RootState) =>
  state.smesher.postSetupState;

export const isCreatingPostData = (state: RootState) =>
  getPostSetupState(state) === PostSetupState.STATE_IN_PROGRESS;

export const getSmeshingOpts = (state: RootState): SmeshingOpts => {
  const {
    smesher: {
      coinbase,
      dataDir,
      numUnits,
      throttle,
      provider,
      maxFileSize,
      postProvingOpts: { threads, nonces },
    },
  } = state;
  return {
    coinbase,
    dataDir,
    numUnits,
    throttle,
    provider: provider || 0,
    maxFileSize,
    threads,
    nonces,
  };
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
  const posState = getPostSetupState(state);
  const opts = getSmeshingOpts(state);
  return (
    (posState === PostSetupState.STATE_PAUSED ||
      posState === PostSetupState.STATE_NOT_STARTED) &&
    isValidSmeshingOpts(opts)
  );
};

export const isSmeshing = (state: RootState) => {
  const postSetupState = getPostSetupState(state);
  return (
    state.smesher.isSmeshingStarted &&
    (postSetupState === PostSetupState.STATE_COMPLETE ||
      postSetupState === PostSetupState.STATE_PREPARED ||
      postSetupState === PostSetupState.STATE_PAUSED ||
      // Until Node will sync enough GRPC API returns NOT STARTED state
      // even if we already started smeshing (so PoS will be created soon)
      (postSetupState === PostSetupState.STATE_NOT_STARTED &&
        isValidSmeshingOpts(getSmeshingOpts(state))))
  );
};
