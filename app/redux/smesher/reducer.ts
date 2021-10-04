import { CustomAction, SmesherState } from '../../types/redux';
import { LOGOUT } from '../auth/actions';
import { PostSetupComputeProvider, PostSetupState, SmesherConfig } from '../../../shared/types';
import { BITS } from '../../types';
import {
  SET_SMESHER_SETTINGS_AND_STARTUP_STATUS,
  SET_SETUP_COMPUTE_PROVIDERS,
  DELETED_POS_DATA,
  STARTED_SMESHING,
  SET_POST_DATA_CREATION_STATUS,
  SET_ACCOUNT_REWARDS,
  SET_SMESHER_CONFIG
} from './actions';

const initialState = {
  smesherId: '',
  postSetupComputeProviders: [] as PostSetupComputeProvider[],
  coinbase: '',
  dataDir: '',
  numUnits: 0,
  throttle: false,
  provider: null,
  commitmentSize: 0,
  numLabelsWritten: 0,
  postSetupState: PostSetupState.STATE_NOT_STARTED,
  postProgressError: '',
  rewards: [],
  config: {} as SmesherConfig
};

const reducer = (state: SmesherState = initialState, action: CustomAction) => {
  switch (action.type) {
    case SET_SMESHER_SETTINGS_AND_STARTUP_STATUS: {
      const {
        payload: { config, smesherId, postSetupState, numLabelsWritten, errorMessage }
      } = action;

      return {
        ...state,
        config,
        smesherId,
        numLabelsWritten,
        postSetupState,
        postProgressError: postSetupState === PostSetupState.STATE_ERROR ? errorMessage : ''
      };
    }
    case SET_SETUP_COMPUTE_PROVIDERS: {
      return { ...state, postSetupComputeProviders: action.payload };
    }
    case SET_SMESHER_CONFIG: {
      const { coinbase, dataDir, numUnits, computeProviderId, throttle } = action.payload.smeshingConfig;
      const commitmentSize = state.config ? (state.config.labelsPerUnit * state.config.bitsPerLabel * numUnits) / BITS : 0;
      return { ...state, coinbase, dataDir, numUnits, throttle, computeProviderId, commitmentSize };
    }
    case STARTED_SMESHING: {
      const {
        payload: { coinbase, dataDir, numUnits, provider, throttle }
      } = action;
      const commitmentSize = state.config ? (state.config.labelsPerUnit * state.config.bitsPerLabel * numUnits) / BITS : 0;
      return { ...state, coinbase, dataDir, numUnits, throttle, provider, commitmentSize };
    }
    case DELETED_POS_DATA: {
      return {
        ...state,
        coinbase: '',
        dataDir: '',
        numUnits: 0,
        throttle: false,
        provider: null,
        commitmentSize: 0,
        numLabelsWritten: 0,
        postSetupState: PostSetupState.STATE_NOT_STARTED,
        postProgressError: ''
      };
    }
    case SET_POST_DATA_CREATION_STATUS: {
      const {
        payload: { error, postSetupState, numLabelsWritten, errorMessage }
      } = action;
      if (error || postSetupState === PostSetupState.STATE_ERROR) {
        return { ...state, postProgressError: errorMessage || error.message };
      }
      return {
        ...state,
        numLabelsWritten: numLabelsWritten || state.numLabelsWritten,
        postSetupState,
        postProgressError: ''
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
