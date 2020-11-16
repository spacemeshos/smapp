import { AppThDispatch } from '../../types';

export const THEME_SWITCHER = 'THEME_SWITCHER';

export const switchTheme = () => async (dispatch: AppThDispatch) => {
  dispatch({ type: THEME_SWITCHER });
};
