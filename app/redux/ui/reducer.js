import { THEME_SWITCHER } from '/redux/ui/actions';
import type { Action, StoreStateType } from '/types';

const initialState = {
  isDarkMode: false
};

const reducer = (state: StoreStateType = initialState, action: Action) => {
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
