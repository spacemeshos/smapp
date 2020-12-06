import { CustomAction, SmesherState } from '../../types/redux';
import { fileStatusEnums } from '../../vars';
import { LOGOUT } from '../auth/actions';
import { SET_SMESHER_SETTINGS, DELETED_POS_DATA, STARTED_CREATING_POS_DATA, SET_POST_DATA_CREATION_STATUS, SET_IS_SMESHING, SET_ACCOUNT_REWARDS } from './actions';

const initialState = {
  coinbase: '',
  dataDir: '',
  minCommitmentSize: 0,
  commitmentSize: 0,
  genesisTime: 0,
  networkId: 0,
  isSmeshing: false,
  isCreatingPosData: false,
  postProgress: {},
  postProgressError: null,
  rewards: []
};

const reducer = (state: SmesherState = initialState, action: CustomAction) => {
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
        return { ...state, postProgressError: error, postProgress: {}, isCreatingPosData: false };
      }
      return {
        ...state,
        postProgress: { filesStatus, bytesWritten, errorMessage, errorType },
        isCreatingPosData: filesStatus === fileStatusEnums.FILES_STATUS_PARTIAL,
        postProgressError: null
      };
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
