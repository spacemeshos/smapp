import { CustomAction, SmesherState } from '../../types/redux';
import { LOGOUT } from '../auth/actions';
import {
  DEFAULT_POS_MAX_FILE_SIZE,
  PostSetupProvider as PostSetupProviders,
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
  SET_METADATA,
} from './actions';

const initialState = {
  smesherId: '',
  isSmeshingStarted: false,
  postSetupProviders: [] as PostSetupProviders[],
  coinbase: '',
  dataDir: '',
  freeSpace: 0,
  numUnits: 0,
  throttle: false,
  provider: null,
  maxFileSize: DEFAULT_POS_MAX_FILE_SIZE,
  commitmentSize: 0,
  numLabelsWritten: 0,
  postSetupState: PostSetupState.STATE_NOT_STARTED,
  postProgressError: '',
  rewards: [],
  metadata: {
    smeshingStart: null,
    posInitStart: null,
  },
  rewardsInfo: {
    total: 0,
    dailyAverage: 0,
    epochs: 0,
    lastEpoch: 0,
    layers: 0,
  },
  activations: [],
  events: [],
  config: {} as SmesherConfig,
};

const reducer = (state: SmesherState = initialState, action: CustomAction) => {
  switch (action.type) {
    case SET_SMESHER_SETTINGS_AND_STARTUP_STATUS: {
      const {
        payload: {
          config,
          smesherId,
          isSmeshingStarted,
          postSetupState,
          numLabelsWritten,
          numUnits,
          maxFileSize,
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
        maxFileSize,
        numLabelsWritten,
        postSetupState,
        commitmentSize,
        isSmeshingStarted,
      };
    }
    case SET_SETUP_COMPUTE_PROVIDERS: {
      const newState: SmesherState = {
        ...state,
        postSetupProviders: action.payload,
      };
      return newState;
    }
    case SET_SMESHER_CONFIG: {
      return {
        ...state,
        ...action.payload.smeshingConfig,
        freeSpace: action.payload.freeSpace.calculatedFreeSpace,
      };
    }
    case STARTED_SMESHING: {
      const {
        payload: {
          coinbase,
          dataDir,
          numUnits,
          provider,
          throttle,
          maxFileSize,
        },
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
        maxFileSize,
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
        maxFileSize: DEFAULT_POS_MAX_FILE_SIZE,
        throttle: false,
        provider: null,
        commitmentSize: 0,
        numLabelsWritten: 0,
        postSetupState: PostSetupState.STATE_NOT_STARTED,
      };
    }
    case PAUSED_SMESHING: {
      return {
        ...state,
        postSetupState: PostSetupState.STATE_PAUSED,
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
        payload: { postSetupState, numLabelsWritten },
      } = action;

      return {
        ...state,
        numLabelsWritten: numLabelsWritten || state.numLabelsWritten,
        postSetupState,
      };
    }
    case LOGOUT:
      return initialState;
    case SET_METADATA: {
      const { payload } = action;

      return {
        ...state,
        metadata: { ...payload },
      };
    }
    case IPC_BATCH_SYNC: {
      return reduceChunkUpdate('smesher', action.payload, state);
    }
    default:
      return state;
  }
};

export default reducer;
