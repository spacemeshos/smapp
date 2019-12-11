// @flow
import type { Action } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import { nodeConsts } from '/vars';
import { CHECK_NODE_CONNECTION, SET_MINING_STATUS, INIT_MINING, SET_GENESIS_TIME, SET_UPCOMING_REWARDS, SET_ACCOUNT_REWARDS, SET_REWARDS_ADDRESS, SET_NODE_IP } from './actions';

const DEFAULT_URL = 'localhost:9091';

const initialState = {
  isConnected: false,
  miningStatus: nodeConsts.NOT_MINING,
  genesisTime: 0,
  timeTillNextAward: 0,
  totalEarnings: 0,
  rewardsAddress: null,
  nodeIpAddress: DEFAULT_URL
};

const reducer = (state: any = initialState, action: Action) => {
  switch (action.type) {
    case CHECK_NODE_CONNECTION: {
      const {
        payload: { isConnected }
      } = action;
      return { ...state, isConnected };
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
    case SET_GENESIS_TIME: {
      const {
        payload: { genesisTime }
      } = action;
      return { ...state, genesisTime };
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
      rewards.forEach((reward) => {
        totalEarnings += reward.totalReward + reward.layerRewardEstimate;
      });
      return { ...state, totalEarnings };
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
