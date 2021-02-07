import { AppThDispatch } from '../../types';
import { eventsService } from '../../infra/eventsService';

export const SET_OS_THEME = 'SET_OS_THEME';
export const THEME_SWITCHER = 'THEME_SWITCHER';
export const HIDE_LEFT_PANEL = 'HIDE_LEFT_PANEL';

export const setOsTheme = () => async (dispatch: AppThDispatch) => {
  const isDarkTheme = await eventsService.getOsThemeColor();
  dispatch({ type: SET_OS_THEME, payload: { isDarkTheme } });
};

export const switchTheme = () => ({ type: THEME_SWITCHER });

export const hideSmesherLeftPanel = () => ({ type: HIDE_LEFT_PANEL });
