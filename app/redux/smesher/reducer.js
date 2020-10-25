// @flow
import type { Action } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import { nodeConsts } from '/vars';
import { SET_SMESHER_SETTINGS, DELETED_POS_DATA, STARTED_CREATING_POS_DATA } from './actions';

const initialState = {
  coinbase: null,
  dataDir: null,
  minCommitmentSize: 0,
  commitmentSize: 0,
  genesisTime: 0,
  networkId: 0,
  isCreatingPosData: false,
  isSmeshing: false
};

const reducer = (state: any = initialState, action: Action) => {
  switch (action.type) {
    case SET_SMESHER_SETTINGS: {
      const {
        payload: { coinbase, dataDir, genesisTime, minCommitmentSize, networkId }
      } = action;
      return { ...state, coinbase, dataDir, genesisTime, minCommitmentSize, networkId };
    }
    case STARTED_CREATING_POS_DATA: {
      const {
        payload: { coinbase, commitmentSize, throttle, provider }
      } = action;
      return { ...state, coinbase, commitmentSize, throttle, provider };
    }
    case DELETED_POS_DATA: {
      return initialState;
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
