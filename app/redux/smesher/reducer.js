// @flow
import type { Action } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import { SET_SMESHER_SETTINGS, DELETED_POS_DATA, STARTED_CREATING_POS_DATA, SET_POST_DATA_CREATION_STATUS, SET_IS_SMESHING } from './actions';

const initialState = {
  coinbase: null,
  dataDir: null,
  minCommitmentSize: 0,
  commitmentSize: 0,
  genesisTime: 0,
  networkId: 0,
  isSmeshing: false,
  postProgress: {},
  postProgressError: null
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
    case SET_IS_SMESHING: {
      const {
        payload: { isSmeshing }
      } = action;
      return { ...state, isSmeshing };
    }
    case SET_POST_DATA_CREATION_STATUS: {
      const {
        payload: { error, filesStatus, bytesWritten, errorMessage, errorType }
      } = action;
      if (error) {
        return { ...state, postProgressError: error, postProgress: {} };
      }
      return { ...state, postProgress: { filesStatus, bytesWritten, errorMessage, errorType }, postProgressError: null };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
