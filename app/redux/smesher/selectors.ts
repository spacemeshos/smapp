import {
  PostSetupState,
  Reward,
  RewardsInfo,
  SmeshingOpts,
} from '../../../shared/types';
import { RootState } from '../../types';
import { EMPTY_REWARDS_INFO, calculateRewardsInfo } from './rewardsInfo';

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
      provider,
      maxFileSize,
      postProvingOpts: { threads, nonces },
    },
  } = state;
  return {
    coinbase,
    dataDir,
    numUnits,
    provider: provider || 0,
    maxFileSize,
    threads,
    nonces,
  };
};

export const getRewards = (state: RootState): Reward[] => {
  const { coinbase } = state.smesher;
  return state.wallet.rewards[coinbase] || [];
};

export const getRewardsInfo = (() => {
  // Global memoization
  let lastRewards: Reward[] = [];
  let lastResult: RewardsInfo = {
    ...EMPTY_REWARDS_INFO,
  };

  return (state: RootState): RewardsInfo => {
    const rewards = getRewards(state);

    if (rewards.length === lastRewards.length) {
      return lastResult;
    }
    if (rewards.length === 0) {
      lastRewards = [];
      lastResult = { ...EMPTY_REWARDS_INFO };
      return lastResult;
    }

    const { layersPerEpoch } = state.network;
    const newRewards = rewards.slice(lastRewards.length - rewards.length);
    const result = calculateRewardsInfo(lastResult, layersPerEpoch, newRewards);

    // Update memoized values
    lastRewards = rewards;
    lastResult = result;

    return lastResult;
  };
})();

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
