import modern from './variants/modern';
import light from './variants/light';
import dark from './variants/dark';

export const UI_DEFAULT_SKIN = 0;
export const UI_DARK_SKIN = 1;
export const UI_LIGHT_SKIN = 2;

export const SKINS = {
  [UI_DEFAULT_SKIN]: 'modern',
  [UI_DARK_SKIN]: 'dark',
  [UI_LIGHT_SKIN]: 'light',
};

export const isDarkMode = (mode) => mode === UI_DARK_SKIN;
export const isLightMode = (mode) => mode === UI_LIGHT_SKIN;
export const isModernMode = (mode) => mode === UI_DEFAULT_SKIN;

export const getThemeById = (index: number) => {
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
