// @flow
import type { Action } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import { nodeConsts } from '/vars';
import { SET_MINING_STATUS, SET_NODE_SETTINGS, INIT_MINING, SET_UPCOMING_REWARDS, SET_REWARDS_ADDRESS, SET_NODE_IP, SET_NODE_STATUS, SET_ACCOUNT_REWARDS } from './actions';

const initialState = {
  status: null,
  miningStatus: nodeConsts.MINING_UNSET,
  rewardsAddress: null,
  genesisTime: 0,
  networkId: 0,
  commitmentSize: 0,
  layerDuration: 0,
  stateRootHash: null,
  port: '',
  rewards: [],
  timeTillNextAward: 0,
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
        payload: { address, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash, port }
      } = action;
      return { ...state, rewardsAddress: address, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash, port };
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
