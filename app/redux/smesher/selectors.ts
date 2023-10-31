import * as R from 'ramda';
import { epochByLayer } from '../../../shared/layerUtils';
import {
  PostSetupState,
  Reward,
  RewardsInfo,
  SmeshingOpts,
} from '../../../shared/types';
import { RootState } from '../../types';
import { getTimestampByLayerFn } from '../network/selectors';

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

export const getRewardsInfo = (state: RootState): RewardsInfo => {
  const getLayerTime = getTimestampByLayerFn(state);
  const layerPerEpoch = state.network.layersPerEpoch;
  const curLayer = state.node.status?.syncedLayer || 0;
  const getEpoch = epochByLayer(layerPerEpoch);
  const curEpoch = getEpoch(curLayer);
  const rewards = getRewards(state);

  const sums = rewards.reduce(
    (acc, next) => ({
      total: acc.total + next.amount,
      layers: new Set(acc.layers).add(next.layer),
      epochs: new Set(acc.epochs).add(getEpoch(next.layer)),
    }),
    {
      total: 0,
      layers: new Set(),
      epochs: new Set(),
    }
  );

  const lastEpoch = R.compose(
    R.reduce((acc, next: Reward) => acc + next.amount, 0),
    R.filter((reward: Reward) => getEpoch(reward.layer) === curEpoch)
  )(rewards);

  const dailyAverage =
    rewards.length > 2
      ? (sums.total /
          (getLayerTime(rewards[rewards.length - 1].layer) -
            getLayerTime(rewards[0].layer))) *
        (24 * 1000 * 60 * 60)
      : 0;

  return {
    total: sums.total,
    lastEpoch,
    layers: sums.layers.size,
    epochs: sums.epochs.size,
    dailyAverage,
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
