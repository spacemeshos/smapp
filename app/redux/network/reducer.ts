import { NetworkState, CustomAction } from '../../types';
import { SET_NETWORK_DEFINITIONS, SET_CURRENT_LAYER, SET_STATE_ROOT_HASH } from './actions';

const initialState: NetworkState = {
  netId: '',
  netName: '',
  genesisTime: '',
  layerDurationSec: 0,
  currentLayer: -1,
  rootHash: '',
  explorerUrl: '',
};

const reducer = (state: NetworkState = initialState, action: CustomAction) => {
  switch (action.type) {
    case SET_NETWORK_DEFINITIONS: {
      const {
        payload: {
          definitions: { netId, netName, genesisTime, explorerUrl, layerDurationSec },
        },
      } = action;
      return { ...state, netId, netName, genesisTime, explorerUrl, layerDurationSec };
    }
    case SET_CURRENT_LAYER: {
      const {
        payload: { currentLayer },
      } = action;
      return currentLayer === -1 ? state : { ...state, currentLayer };
    }
    case SET_STATE_ROOT_HASH: {
      const {
        payload: { rootHash },
      } = action;
      return rootHash ? { ...state, rootHash } : state;
    }
    default:
      return state;
  }
};

export default reducer;
