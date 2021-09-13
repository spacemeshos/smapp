import { UiState, CustomAction } from '../../types';
import { SET_OS_THEME, THEME_SWITCHER, HIDE_LEFT_PANEL, SET_UI_ERROR, SHOW_CLOSING_APP_MODAL } from './actions';

const initialState = {
  isDarkMode: false,
  isClosingApp: false,
  hideSmesherLeftPanel: false,
  error: null
};

const reducer = (state: UiState = initialState, action: CustomAction) => {
  switch (action.type) {
    case SET_OS_THEME: {
      const {
        payload: { isDarkTheme }
      } = action;
      return { ...state, isDarkMode: isDarkTheme };
    }
    case THEME_SWITCHER: {
      const isDarkMode = !state.isDarkMode;
      return { ...state, isDarkMode };
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
