import modern from './variants/modern';
import light from './variants/light';
import dark from './variants/dark';

export const UI_DEFAULT_SKIN = '0';
export const UI_DARK_SKIN = '1';
export const UI_LIGHT_SKIN = '2';
export const CLIENT_SETTINGS_THEME_KEY = 'clientSettingsTheme';

export const setClientSettingsTheme = (id: string) =>
  window.localStorage.setItem(CLIENT_SETTINGS_THEME_KEY, id);

export const getClientSettingsTheme = (): string | null =>
  window.localStorage.getItem(CLIENT_SETTINGS_THEME_KEY);

export const SKINS = {
  [UI_DEFAULT_SKIN]: 'modern',
  [UI_DARK_SKIN]: 'dark',
  [UI_LIGHT_SKIN]: 'light',
};
export const isValidSettingsTheme = (id: string): boolean =>
  [UI_DARK_SKIN, UI_LIGHT_SKIN, UI_DEFAULT_SKIN].includes(id);
export const isDarkBackground = (skinId: string | null) =>
  skinId !== UI_LIGHT_SKIN;

export const getSkinId = (hasWalletFiles: boolean) => {
  const id = getClientSettingsTheme();
  const isValid = id !== null && isValidSettingsTheme(id);

  if (isValid) {
    return id;
  }

  // means switch between skins depends on OS
  if (hasWalletFiles) {
    return null;
  }

  return UI_DEFAULT_SKIN;
};

export const getThemeById = (index: string | null, isDark: boolean) => {
  // not selected
  if (index === null) {
    return isDark ? dark : light;
  }

  const themeName = SKINS[index];

  switch (themeName) {
    case 'modern':
      return modern;
    case 'light':
      return light;
    case 'dark':
      return dark;
    default:
      return modern;
  }
};

export type DefaultSkin = typeof modern | typeof light | typeof dark;
