import { UiState, CustomAction } from '../../types';
import { isDarkBackground } from '../../theme';
import { IPC_BATCH_SYNC, reduceChunkUpdate } from '../ipcBatchSync';
import {
  SET_OS_THEME,
  // THEME_SWITCHER,
  SET_UI_ERROR,
  SHOW_CLOSING_APP_MODAL,
  SKIN_SWITCHER,
  ADD_WARNING,
  OMIT_WARNING,
} from './actions';

const initialState: UiState = {
  isDarkMode: false,
  isClosingApp: false,
  skinId: null,
  error: null,
  warnings: [],
  osPlatform: '',
};

const reducer = (state: UiState = initialState, action: CustomAction) => {
  switch (action.type) {
    case SET_OS_THEME: {
      const {
        payload: { isDarkTheme },
      } = action;
      return { ...state, isDarkMode: isDarkTheme };
    }
    case SKIN_SWITCHER: {
      return {
        ...state,
        skinId: action.payload,
        isDarkMode: isDarkBackground(action.payload),
      };
    }

    case SET_UI_ERROR:
      return { ...state, error: action.payload };
    case ADD_WARNING:
      return {
        ...state,
        warnings: [...state.warnings, action.payload],
      };
    case OMIT_WARNING:
      return {
        ...state,
        warnings: state.warnings.filter((w) => w !== action.payload),
      };
    case SHOW_CLOSING_APP_MODAL:
      return { ...state, isClosingApp: true };
    case IPC_BATCH_SYNC:
      return reduceChunkUpdate('ui', action.payload, state);
    default:
      return state;
  }
};

export default reducer;
