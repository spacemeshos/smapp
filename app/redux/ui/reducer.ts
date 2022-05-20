import { UiState, CustomAction } from '../../types';
import { isDarkBackground } from '../../theme';
import {
  SET_OS_THEME,
  // THEME_SWITCHER,
  HIDE_LEFT_PANEL,
  SET_UI_ERROR,
  SHOW_CLOSING_APP_MODAL,
  SKIN_SWITCHER,
} from './actions';

const initialState: UiState = {
  isDarkMode: false,
  isClosingApp: false,
  hideSmesherLeftPanel: false,
  skinId: null,
  error: null,
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
    case HIDE_LEFT_PANEL: {
      return { ...state, hideSmesherLeftPanel: true };
    }
    case SET_UI_ERROR:
      return { ...state, error: action.payload };
    case SHOW_CLOSING_APP_MODAL:
      return { ...state, isClosingApp: true };
    default:
      return state;
  }
};

export default reducer;
