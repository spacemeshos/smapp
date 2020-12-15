import { UiState, CustomAction } from '../../types';
import { SET_OS_THEME, THEME_SWITCHER, HIDE_LEFT_PANEL } from './actions';

const initialState = {
  isDarkMode: false
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
    default:
      return state;
  }
};

export default reducer;
