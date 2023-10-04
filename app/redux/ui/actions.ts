import { AppThDispatch } from '../../types';
import { eventsService } from '../../infra/eventsService';
import { getSkinId, isDarkBackground } from '../../theme';
import { AnyWarningObject } from '../../../shared/warning';

export const SET_OS_THEME = 'SET_OS_THEME';
export const SKIN_SWITCHER = 'SKIN_SWITCHER';
export const SET_UI_ERROR = 'SET_UI_ERROR';
export const ADD_WARNING = 'ADD_WARNING';
export const OMIT_WARNING = 'OMIT_WARNING';

export const SHOW_CLOSING_APP_MODAL = 'SHOW_CLOSING_APP_MODAL';

export function switchSkin(type: string | null) {
  return {
    type: SKIN_SWITCHER,
    payload: type,
  };
}

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
