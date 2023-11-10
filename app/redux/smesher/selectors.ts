import { epochByLayer, timestampByLayer } from '../../../shared/layerUtils';
import {
  PostSetupState,
  Reward,
  RewardsInfo,
  SmeshingOpts,
} from '../../../shared/types';
import { RootState } from '../../types';
import { DAY } from '../../../shared/constants';

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

export const calculateDailyAverage = (
  rewards: Reward[],
  total: number,
  genesisTime: string,
  layerDurationSec: number
): number => {
  if (rewards.length === 0) return 0;
  if (rewards.length === 1) return rewards[0].amount;
  const getLayerTime = timestampByLayer(genesisTime, layerDurationSec);
  const lastRewardTime = getLayerTime(rewards[rewards.length - 1].layer);
  const firstRewardTime = getLayerTime(rewards[0].layer);
  return (total / (lastRewardTime - firstRewardTime)) * DAY;
};

const EMPTY_REWARDS_INFO: RewardsInfo = {
  total: 0,
  layers: 0,
  epochs: 0,
  lastLayer: 0,
  lastEpoch: 0,
  dailyAverage: 0,
  lastEpochRewards: 0,
};

export const getRewardsInfo = (() => {
  // Global memoization
  let lastRewards: Reward[] = [];
  let lastResult: RewardsInfo = {
    ...EMPTY_REWARDS_INFO,
  };

  return (state: RootState): RewardsInfo => {
    const layerPerEpoch = state.network.layersPerEpoch;
    const getEpoch = epochByLayer(layerPerEpoch);
    const rewards = getRewards(state);

    if (rewards.length === lastRewards.length) {
      return lastResult;
    }
    if (rewards.length === 0) {
      lastRewards = [];
      lastResult = { ...EMPTY_REWARDS_INFO };
      return lastResult;
    }

    const newRewards = rewards.slice(lastRewards.length - rewards.length);
    const calc = newRewards.reduce((acc, next): RewardsInfo => {
      const epoch = getEpoch(next.layer);
      return {
        total: acc.total + next.amount,
        lastLayer: next.layer,
        lastEpoch: epoch,
        layers: acc.lastLayer < next.layer ? acc.layers + 1 : acc.layers,
        epochs: acc.lastEpoch < epoch ? acc.epochs + 1 : acc.epochs,
        lastEpochRewards:
          acc.lastEpoch === epoch
            ? acc.lastEpochRewards + next.amount
            : next.amount,
        dailyAverage: acc.dailyAverage,
      };
    }, lastResult);

    const dailyAverage = calculateDailyAverage(
      rewards,
      calc.total,
      state.network.genesisTime,
      state.network.layerDurationSec
    );

    const result: RewardsInfo = {
      ...calc,
      dailyAverage,
    };

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
