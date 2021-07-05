import { CustomAction, SmesherState } from '../../types/redux';
import { fileStatusEnums } from '../../vars';
import { LOGOUT } from '../auth/actions';
import { SET_SMESHER_SETTINGS, DELETED_POS_DATA, STARTED_SMESHING, SET_POST_DATA_CREATION_STATUS, SET_IS_SMESHING, SET_ACCOUNT_REWARDS } from './actions';

const initialState = {
  coinbase: '',
  dataDir: '',
  commitmentSize: 0,
  throttle: false,
  provider: null,
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
        payload: { coinbase, dataDir }
      } = action;
      return { ...state, coinbase, dataDir };
    }
    case STARTED_SMESHING: {
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
