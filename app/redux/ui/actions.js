// @flow

import { Action, Dispatch } from '/types';

export const THEME_SWITCHER: string = 'THEME_SWITCHER';

export const switchTheme = (): Action => async (dispatch: Dispatch): Dispatch => {
  dispatch({ type: THEME_SWITCHER });
};
