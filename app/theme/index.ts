import modern from './variants/modern';
import light from './variants/light';
import dark from './variants/dark';

enum Themes {
  MODERN_SKIN = '0',
  DARK_SKIN = '1',
  LIGHT_SKIN = '2',
}

export const CLIENT_SETTINGS_THEME_KEY = 'clientSettingsTheme';

export const setClientSettingsTheme = (id: string) =>
  window.localStorage.setItem(CLIENT_SETTINGS_THEME_KEY, id);

export const getClientSettingsTheme = (): string | null =>
  window.localStorage.getItem(CLIENT_SETTINGS_THEME_KEY);

export const SKINS = {
  [Themes.MODERN_SKIN]: modern,
  [Themes.DARK_SKIN]: dark,
  [Themes.LIGHT_SKIN]: light,
};
export const isValidSettingsTheme = (id: string): boolean =>
  Object.keys(SKINS).includes(id);
export const isDarkBackground = (skinId: string | null) =>
  skinId !== Themes.LIGHT_SKIN;

export const getSkinId = () => {
  const id = getClientSettingsTheme();
  const isValid = id !== null && isValidSettingsTheme(id);

  return isValid ? id : Themes.MODERN_SKIN;
};

export const getThemeById = (index: string | null, isDark: boolean) => {
  if (!index) return isDark ? dark : light;

  return SKINS[index] || modern;
};
