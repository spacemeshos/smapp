// @flow
import type { Action } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import { nodeConsts } from '/vars';
import { SET_NODE_SETTINGS, SET_UPCOMING_REWARDS, SET_REWARDS_ADDRESS, SET_NODE_IP, SET_NODE_STATUS, SET_ACCOUNT_REWARDS } from './actions';

const initialState = {
  status: null,
  stateRootHash: null,
  port: '',
  rewards: [],
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
        payload: { stateRootHash, port }
      } = action;
      return { ...state, stateRootHash, port };
    }
    case SET_UPCOMING_REWARDS: {
      const {
        payload: { timeTillNextAward }
      } = action;
      return { ...state, timeTillNextAward };
    }
    case SET_REWARDS_ADDRESS: {
      const {
        payload: { address }
      } = action;
      return { ...state, coinbase: address };
    }
    case SET_NODE_IP: {
      const {
        payload: { nodeIpAddress }
      } = action;
      return { ...state, nodeIpAddress };
    }
    case SET_ACCOUNT_REWARDS: {
      const { rewards } = action.payload;
      return { ...state, rewards };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
