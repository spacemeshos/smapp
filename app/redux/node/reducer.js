// @flow
import type { Action } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import { nodeConsts } from '/vars';
import { CHECK_NODE_CONNECTION, SET_MINING_STATUS, INIT_MINING, SET_TOTAL_AWARDS, SET_UPCOMING_REWARDS, SET_AWARDS_ADDRESS, SET_NODE_IP, SET_GENESIS_TIME } from './actions';

const DEFAULT_URL = 'localhost:9091';

const initialState = {
  isConnected: false,
  miningStatus: nodeConsts.NOT_MINING,
  genesisTime: 0,
  timeTillNextReward: 0,
  totalEarnings: 0,
  awardsAddress: null,
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
      return { ...state, awardsAddress: address, miningStatus: nodeConsts.IN_SETUP };
    }
    case SET_GENESIS_TIME: {
      const {
        payload: { genesisTime }
      } = action;
      return { ...state, genesisTime };
    }
    case SET_TOTAL_AWARDS: {
      const {
        payload: { totalEarnings }
      } = action;
      return { ...state, totalEarnings };
    }
    case SET_UPCOMING_REWARDS: {
      const {
        payload: { timeTillNextReward }
      } = action;
      return { ...state, timeTillNextReward };
    }
    case SET_AWARDS_ADDRESS: {
      const {
        payload: { address }
      } = action;
      return { ...state, awardsAddress: address };
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
