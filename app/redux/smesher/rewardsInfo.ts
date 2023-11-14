// Utility functions for `getRewardsInfo` selector

import { DAY } from '../../../shared/constants';
import { epochByLayer, timestampByLayer } from '../../../shared/layerUtils';
import { Reward, RewardsInfo } from '../../../shared/types';

export const EMPTY_REWARDS_INFO: RewardsInfo = {
  total: 0,
  layers: 0,
  epochs: 0,
  lastLayer: 0,
  lastEpoch: 0,
  lastEpochRewards: 0,
};

export const calculateDailyAverage = (
  genesisTime: string,
  layerDurationSec: number,
  total: number,
  rewards: Reward[]
): number => {
  if (rewards.length === 0) return 0;
  if (rewards.length === 1) return rewards[0].amount;
  const getLayerTime = timestampByLayer(genesisTime, layerDurationSec);
  const lastRewardTime = getLayerTime(rewards[rewards.length - 1].layer);
  const firstRewardTime = getLayerTime(rewards[0].layer);
  return (total / (lastRewardTime - firstRewardTime)) * DAY;
};

export const calculateRewardsInfo = (
  prevResults: RewardsInfo,
  layersPerEpoch: number,
  rewards: Reward[]
) => {
  const getEpoch = epochByLayer(layersPerEpoch);
  return rewards.reduce((acc, next): RewardsInfo => {
    const epoch = getEpoch(next.layer);
    return {
      ...acc,
      total: acc.total + next.amount,
      lastLayer: next.layer,
      lastEpoch: epoch,
      layers: acc.lastLayer < next.layer ? acc.layers + 1 : acc.layers,
      epochs: acc.lastEpoch < epoch ? acc.epochs + 1 : acc.epochs,
      lastEpochRewards:
        acc.lastEpoch === epoch
          ? acc.lastEpochRewards + next.amount
          : next.amount,
    };
  }, prevResults);
};
