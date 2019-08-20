// @flow
import type { Action } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import { INIT_MINING, GET_TOTAL_AWARDS, SET_UPCOMING_EARNINGS, SET_AWARDS_ADDRESS, CHECK_NODE_CONNECTION, SET_NODE_IP } from './actions';

const DEFAULT_URL = 'localhost:9091';

const initialState = {
  drive: null,
  capacity: null,
  progress: null,
  totalRunningTime: 0,
  totalEarnings: 0,
  timeTillNextReward: 0,
  awardsAddress: null,
  isConnected: false,
  nodeIpAddress: DEFAULT_URL
};

const reducer = (state: any = initialState, action: Action) => {
  switch (action.type) {
    case INIT_MINING: {
      const {
        payload: { capacity, drive, address }
      } = action;
      return { ...state, capacity, drive, awardsAddress: address };
    }
    case GET_TOTAL_AWARDS: {
      const {
        payload: { totalEarnings }
      } = action;
      return { ...state, totalEarnings };
    }
    case SET_UPCOMING_EARNINGS: {
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
    case CHECK_NODE_CONNECTION: {
      const {
        payload: { isConnected }
      } = action;
      return { ...state, isConnected };
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
