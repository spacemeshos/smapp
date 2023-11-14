import { Reward } from '../shared/types';
import {
  EMPTY_REWARDS_INFO,
  calculateRewardsInfo,
} from '../app/redux/smesher/rewardsInfo';

const createReward = (amount: number, layer: number): Reward => ({
  amount,
  layerReward: amount,
  layerComputed: amount,
  layer,
  coinbase: 'test',
});

describe('rewardsInfo calculation', () => {
  describe('calculateRewardsInfo', () => {
    it('for empty rewards', () => {
      expect(calculateRewardsInfo(EMPTY_REWARDS_INFO, 5, [])).toEqual(
        EMPTY_REWARDS_INFO
      );
    });
    it('for single reward', () => {
      expect(
        calculateRewardsInfo(EMPTY_REWARDS_INFO, 5, [createReward(100, 10)])
      ).toEqual({
        total: 100,
        layers: 1,
        epochs: 1,
        lastLayer: 10,
        lastEpoch: 2,
        lastEpochRewards: 100,
      });
    });
    it('from scratch (sequentially, 9 layers)', () => {
      expect(
        calculateRewardsInfo(EMPTY_REWARDS_INFO, 5, [
          createReward(100, 1),
          createReward(100, 2),
          createReward(100, 3),
          createReward(100, 4),
          createReward(100, 5),
          createReward(50, 6),
          createReward(50, 7),
          createReward(50, 8),
          createReward(50, 9),
        ])
      ).toEqual({
        total: 700,
        layers: 9,
        epochs: 1,
        lastLayer: 9,
        lastEpoch: 1,
        lastEpochRewards: 300,
      });
    });
    it('based on previous calculations (sequentially, 9 + 3 layers)', () => {
      expect(
        calculateRewardsInfo(
          {
            total: 700,
            layers: 9,
            epochs: 1,
            lastLayer: 9,
            lastEpoch: 1,
            lastEpochRewards: 300,
          },
          5,
          [
            createReward(30, 10),
            createReward(35, 10),
            createReward(30, 11),
            createReward(30, 12),
          ]
        )
      ).toEqual({
        total: 700 + 125,
        layers: 12,
        epochs: 2,
        lastLayer: 12,
        lastEpoch: 2,
        lastEpochRewards: 125,
      });
    });
    it('based on previous calculations (with gaps)', () => {
      expect(
        calculateRewardsInfo(
          {
            total: 700,
            layers: 9,
            epochs: 1,
            lastLayer: 9,
            lastEpoch: 1,
            lastEpochRewards: 300,
          },
          5,
          [
            createReward(30, 50),
            createReward(30, 64),
            createReward(30, 100),
            createReward(35, 101),
            createReward(30, 102),
            createReward(30, 102),
          ]
        )
      ).toEqual({
        total: 700 + 60 + 125,
        layers: 14,
        epochs: 4,
        lastLayer: 102,
        lastEpoch: 20,
        lastEpochRewards: 125,
      });
    });
  });
});
