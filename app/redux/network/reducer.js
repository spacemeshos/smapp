// @flow
import type { Action } from '/types';
import { CHECK_NETWORK_CONNECTION, SET_NODE_IP } from './actions';

const DEFAULT_URL = 'localhost:9091';

const initialState = {
  isConnected: false,
  nodeIpAddress: DEFAULT_URL
};

const reducer = (state: any = initialState, action: Action) => {
  switch (action.type) {
    case CHECK_NETWORK_CONNECTION: {
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
    default:
      return state;
  }
};

export default reducer;
