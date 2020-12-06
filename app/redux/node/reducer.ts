// import { nodeConsts } from '../../vars';
import type { NodeState, CustomAction } from '../../types';
import { LOGOUT } from '../auth/actions';
import { SET_NODE_SETTINGS, SET_NODE_IP, SET_NODE_STATUS } from './actions';

const initialState = {
  status: null,
  nodeIndicator: { hasError: false, color: '', message: '', statusText: '' },
  genesisTime: 0,
  networkId: 0,
  commitmentSize: 0,
  layerDuration: 0,
  stateRootHash: '',
  port: '',
  posDataPath: '',
  nodeIpAddress: ''
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
        payload: { stateRootHash, port }
      } = action;
      return { ...state, stateRootHash, port };
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
