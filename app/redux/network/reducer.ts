import { NetworkState, CustomAction } from '../../types';
import { SET_NETWORK_DEFINITIONS, SET_CURRENT_LAYER, SET_STATE_ROOT_HASH } from './actions';

const initialState = {
  netId: '',
  netName: '',
  genesisTime: '',
  minCommitmentSize: 0,
  currentLayer: -1,
  rootHash: '',
  explorerUrl: ''
};

const reducer = (state: NetworkState = initialState, action: CustomAction) => {
  switch (action.type) {
    case SET_NETWORK_DEFINITIONS: {
      const {
        payload: {
          definitions: { netId, netName, genesisTime, minCommitmentSize, explorerUrl }
        }
      } = action;
      return { ...state, netId, netName, genesisTime, minCommitmentSize, explorerUrl };
    }
    case SET_CURRENT_LAYER: {
      const {
        payload: { layer }
      } = action;
      return layer === -1 ? state : { ...state, currentLayer: layer };
    }
    case SET_STATE_ROOT_HASH: {
      const {
        payload: { rootHash }
      } = action;
      return rootHash ? { ...state, rootHash } : state;
    }
    default:
      return state;
  }
};

export default reducer;
