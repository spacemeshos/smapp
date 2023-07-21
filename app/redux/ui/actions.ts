import { AppThDispatch } from '../../types';
import { eventsService } from '../../infra/eventsService';
import { getSkinId, isDarkBackground } from '../../theme';
import { AnyWarningObject, WarningType } from '../../../shared/warning';

export const SET_OS_THEME = 'SET_OS_THEME';
export const SKIN_SWITCHER = 'SKIN_SWITCHER';
export const HIDE_LEFT_PANEL = 'HIDE_LEFT_PANEL';
export const SET_UI_ERROR = 'SET_UI_ERROR';
export const ADD_WARNING = 'ADD_WARNING';
export const OMIT_WARNING = 'OMIT_WARNING';
export const OMIT_ALL_WARNINGS_BY_TYPE = 'OMIT_ALL_WARNINGS_BY_TYPE';

export const SHOW_CLOSING_APP_MODAL = 'SHOW_CLOSING_APP_MODAL';

export const switchSkin = (type: string | null) => ({
  type: SKIN_SWITCHER,
  payload: type,
});

export const hideSmesherLeftPanel = () => ({ type: HIDE_LEFT_PANEL });

export const setUiError = (err: Error) => ({
  type: SET_UI_ERROR,
  payload: err,
});

export const addWarning = (warning: AnyWarningObject) => ({
  type: ADD_WARNING,
  payload: warning,
});

export const omitWarning = (warning: AnyWarningObject) => ({
  type: OMIT_WARNING,
  payload: warning,
});

export const omitAllWarningsByType = (type: keyof typeof WarningType) => ({
  type: OMIT_ALL_WARNINGS_BY_TYPE,
  payload: type,
});

export const showClosingAppModal = () => ({
  type: SHOW_CLOSING_APP_MODAL,
});

export const setOsTheme = () => async (dispatch: AppThDispatch) => {
  const isDarkTheme = await eventsService.getOsThemeColor();

  const calculatedSkinId = getSkinId();
  const isSkinDarkMode = isDarkBackground(calculatedSkinId) || isDarkTheme;
  dispatch({ type: SET_OS_THEME, payload: { isSkinDarkMode } });
  dispatch(switchSkin(calculatedSkinId));
};
