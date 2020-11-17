import { nodeConsts } from '../../vars';
import type { NodeState, CustomAction } from '../../types';
import { LOGOUT } from '../auth/actions';
import { SET_MINING_STATUS, SET_NODE_SETTINGS, INIT_MINING, SET_REWARDS_ADDRESS, SET_NODE_IP, SET_NODE_STATUS, SET_ACCOUNT_REWARDS } from './actions';

const initialState = {
  status: null,
  nodeIndicator: { hasError: false, color: '', message: '', statusText: '' },
  miningStatus: nodeConsts.MINING_UNSET,
  rewardsAddress: '',
  genesisTime: 0,
  networkId: 0,
  commitmentSize: 0,
  layerDuration: 0,
  stateRootHash: '',
  port: '',
  rewards: [],
  nodeIpAddress: nodeConsts.DEFAULT_URL,
  posDataPath: ''
};

const reducer = (state: NodeState = initialState, action: CustomAction) => {
  switch (action.type) {
    case SET_NODE_STATUS: {
      const {
        payload: { status, nodeIndicator }
      } = action;

      return { ...state, status, nodeIndicator };
    }
    case SET_NODE_SETTINGS: {
      const {
        payload: { address, posDataPath, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash, port }
      } = action;
      return { ...state, rewardsAddress: address, posDataPath, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash, port };
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
