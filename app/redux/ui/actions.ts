import { AppThDispatch, GetState } from '../../types';
import { eventsService } from '../../infra/eventsService';
import { getSkinId, isDarkBackground } from '../../theme';

export const SET_OS_THEME = 'SET_OS_THEME';
export const SKIN_SWITCHER = 'SKIN_SWITCHER';
export const HIDE_LEFT_PANEL = 'HIDE_LEFT_PANEL';

export const SET_UI_ERROR = 'SET_UI_ERROR';

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

export const showClosingAppModal = () => ({
  type: SHOW_CLOSING_APP_MODAL,
});

export const setOsTheme = () => async (
  dispatch: AppThDispatch,
  getState: GetState
) => {
  const state = getState();
  const isDarkTheme = await eventsService.getOsThemeColor();

  const hasWallet = state.wallet.walletFiles.length > 0;
  const calculatedSkinId = getSkinId(hasWallet);
  const isSkinDarkMode = isDarkBackground(calculatedSkinId) || isDarkTheme;

  await dispatch({ type: SET_OS_THEME, payload: { isSkinDarkMode } });
  await dispatch(switchSkin(calculatedSkinId));
};
