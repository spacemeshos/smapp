import { UiState, CustomAction } from '../../types';
import { THEME_SWITCHER } from './actions';

const initialState = {
  isDarkMode: false
};

const reducer = (state: UiState = initialState, action: CustomAction) => {
  switch (action.type) {
    case THEME_SWITCHER: {
      const isDarkMode = !state.isDarkMode;
      return { ...state, isDarkMode };
    }
    default:
      return state;
  }
};

export default reducer;
