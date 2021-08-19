import { AppThDispatch } from '../../types';
import { eventsService } from '../../infra/eventsService';

export const SET_OS_THEME = 'SET_OS_THEME';
export const THEME_SWITCHER = 'THEME_SWITCHER';
export const HIDE_LEFT_PANEL = 'HIDE_LEFT_PANEL';

export const SET_UI_ERROR = 'SET_UI_ERROR';

export const SHOW_CLOSING_APP_MODAL = 'SHOW_CLOSING_APP_MODAL';

export const setOsTheme = () => async (dispatch: AppThDispatch) => {
  const isDarkTheme = await eventsService.getOsThemeColor();
  dispatch({ type: SET_OS_THEME, payload: { isDarkTheme } });
};

export const switchTheme = () => ({ type: THEME_SWITCHER });

export const hideSmesherLeftPanel = () => ({ type: HIDE_LEFT_PANEL });

export const setUiError = (err: Error) => ({
  type: SET_UI_ERROR,
  payload: err
});

export const showClosingAppModal = () => ({
  type: SHOW_CLOSING_APP_MODAL
});
