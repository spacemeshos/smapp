// @flow
import type { Action } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import { nodeConsts } from '/vars';
import { SET_MINING_STATUS, SET_NODE_SETTINGS, INIT_MINING, SET_UPCOMING_REWARDS, SET_ACCOUNT_REWARDS, SET_REWARDS_ADDRESS, SET_NODE_IP, SET_NODE_STATUS } from './actions';

const initialState = {
  status: null,
  miningStatus: nodeConsts.NOT_MINING,
  rewardsAddress: null,
  genesisTime: 0,
  networkId: 0,
  commitmentSize: 0,
  layerDuration: 0,
  timeTillNextAward: 0,
  rewards: [],
  totalEarnings: 0,
  totalFeesEarnings: 0,
  nodeIpAddress: nodeConsts.DEFAULT_URL
};

const reducer = (state: any = initialState, action: Action) => {
  switch (action.type) {
    case SET_NODE_STATUS: {
      const {
        payload: { status }
      } = action;
      return { ...state, status };
    }
    case SET_NODE_SETTINGS: {
      const {
        payload: { address, genesisTime, networkId, commitmentSize, layerDuration }
      } = action;
      return { ...state, rewardsAddress: address, genesisTime, networkId, commitmentSize, layerDuration };
    }
    case SET_MINING_STATUS: {
      const {
        payload: { status }
      } = action;
      return { ...state, miningStatus: status };
    }
    case INIT_MINING: {
      const {
        payload: { address }
      } = action;
      return { ...state, rewardsAddress: address, miningStatus: nodeConsts.IN_SETUP };
    }
    case SET_UPCOMING_REWARDS: {
      const {
        payload: { timeTillNextAward }
      } = action;
      return { ...state, timeTillNextAward };
    }
    case SET_ACCOUNT_REWARDS: {
      const {
        payload: { rewards }
      } = action;
      let totalEarnings = 0;
      let totalFeesEarnings = 0;
      rewards.forEach((reward) => {
        totalEarnings += reward.layerRewardEstimate;
        totalFeesEarnings += reward.totalReward - reward.layerRewardEstimate;
      });
      return { ...state, rewards, totalEarnings, totalFeesEarnings };
    }
    case SET_REWARDS_ADDRESS: {
      const {
        payload: { address }
      } = action;
      return { ...state, rewardsAddress: address };
    }
    case SET_NODE_IP: {
      const {
        payload: { nodeIpAddress }
      } = action;
      return { ...state, nodeIpAddress };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
