import { CustomAction, SmesherState } from '../../types/redux';
import { LOGOUT } from '../auth/actions';
import {
  PostSetupComputeProvider,
  PostSetupState,
  SmesherConfig,
} from '../../../shared/types';
import { BITS } from '../../types';
import { IPC_BATCH_SYNC, reduceChunkUpdate } from '../ipcBatchSync';
import {
  SET_SMESHER_SETTINGS_AND_STARTUP_STATUS,
  SET_SETUP_COMPUTE_PROVIDERS,
  DELETED_POS_DATA,
  STARTED_SMESHING,
  SET_POST_DATA_CREATION_STATUS,
  SET_SMESHER_CONFIG,
  PAUSED_SMESHING,
  RESUMED_SMESHING,
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
  rewairdsInfo: {},
  activations: [],
  config: {} as SmesherConfig,
};

const reducer = (state: SmesherState = initialState, action: CustomAction) => {
  switch (action.type) {
    case SET_SMESHER_SETTINGS_AND_STARTUP_STATUS: {
      const {
        payload: {
          config,
          smesherId,
          postSetupState,
          numLabelsWritten,
          errorMessage,
          numUnits,
        },
      } = action;

      const commitmentSize = config
        ? (config.labelsPerUnit * config.bitsPerLabel * numUnits) / BITS
        : 0;

      return {
        ...state,
        config,
        smesherId,
        numUnits,
        numLabelsWritten,
        postSetupState,
        postProgressError:
          postSetupState === PostSetupState.STATE_ERROR ? errorMessage : '',
        commitmentSize,
      };
    }
    case SET_SETUP_COMPUTE_PROVIDERS: {
      return { ...state, postSetupComputeProviders: action.payload };
    }
    case SET_SMESHER_CONFIG: {
      return {
        ...state,
        ...action.payload.smeshingConfig,
      };
    }
    case STARTED_SMESHING: {
      const {
        payload: { coinbase, dataDir, numUnits, provider, throttle },
      } = action;
      const commitmentSize = state.config
        ? (state.config.labelsPerUnit * state.config.bitsPerLabel * numUnits) /
          BITS
        : 0;
      return {
        ...state,
        coinbase,
        dataDir,
        numUnits,
        throttle,
        provider,
        commitmentSize,
      };
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
        postProgressError: '',
      };
    }
    case PAUSED_SMESHING: {
      return {
        ...state,
        postSetupState: PostSetupState.STATE_STOPPED,
      };
    }
    case RESUMED_SMESHING: {
      return {
        ...state,
        postSetupState: PostSetupState.STATE_IN_PROGRESS,
      };
    }
    case SET_POST_DATA_CREATION_STATUS: {
      const {
        payload: { error, postSetupState, numLabelsWritten, errorMessage },
      } = action;
      if (error || postSetupState === PostSetupState.STATE_ERROR) {
        return { ...state, postProgressError: errorMessage || error.message };
      }
      return {
        ...state,
        numLabelsWritten: numLabelsWritten || state.numLabelsWritten,
        postSetupState,
        postProgressError: '',
      };
    }
    case LOGOUT:
      return initialState;
    case IPC_BATCH_SYNC: {
      return reduceChunkUpdate('smesher', action.payload, state);
    }
    default:
      return state;
  }
};

export default reducer;
