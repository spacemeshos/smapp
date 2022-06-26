import colors from '../colors';
import {
  backup,
  tooltip,
  closePopup,
  rightDecoration,
  checkWhite,
  chevronRightBlack,
  chevronLeftBlack,
  chevronBottomBlack,
} from '../../assets/images';

export default {
  colors,
  skinBackground: colors.light110,
  themeName: 'light',
  isDarkMode: false,
  background: {
    active: colors.dark,
    inactive: colors.light140,
  },
  popups: {
    boxRadius: 0,
    iconRadius: 0,
    states: {
      error: {
        backgroundColor: colors.error,
        color: colors.light100,
      },
      success: {
        backgroundColor: colors.light100,
        color: colors.primary100,
      },
      infoTooltip: {
        backgroundColor: colors.light110,
        color: colors.dark100,
      },
    },
  },
  box: {
    radius: 0,
  },
  indicators: {
    radius: 0,
  },
  form: {
    input: {
      states: {
        disable: {
          hasBorder: true,
          borderColor: colors.light150,
          backgroundColor: colors.light120,
          color: colors.light150,
        },
        normal: {
          backgroundColor: colors.light110,
          color: colors.dark45,
          hasBorder: true,
          borderColor: colors.dark100,
        },
        click: {
          backgroundColor: colors.light110,
          color: colors.dark45,
        },
        focus: {
          backgroundColor: colors.light110,
          color: colors.dark45,
        },
      },
      boxRadius: 0,
    },
    dropdown: {
      boxRadius: 0,
      dark: {
        isOutBorder: true,
        borderColor: colors.dark100,
        states: {
          disable: {
            backgroundColor: colors.light120,
            color: colors.dark45,
          },
          normal: {
            backgroundColor: colors.light120,
            color: colors.dark45,
          },
          click: {
            backgroundColor: colors.light120,
            color: colors.dark45,
          },
          hover: {
            backgroundColor: colors.dark20,
            color: colors.dark45,
          },
        },
      },
      light: {
        isOutBorder: true,
        borderColor: colors.dark100,
        states: {
          disable: {
            backgroundColor: colors.light120,
            color: colors.dark45,
          },
          normal: {
            backgroundColor: colors.light120,
            color: colors.dark45,
          },
          click: {
            backgroundColor: colors.light120,
            color: colors.dark45,
          },
          hover: {
            backgroundColor: colors.dark20,
            color: colors.dark45,
          },
        },
      },
    },
  },
  button: {
    primary: {
      settings: {
        hasBorder: true,
      },
      boxRadius: 0,
      padding: {
        left: '7px',
      },
      state: {
        base: colors.primary100,
        hover: colors.primary90,
        focus: colors.dark,
        inactive: colors.light100,
      },
    },
    secondary: {
      settings: {
        hasBorder: true,
      },
      boxRadius: 0,
      padding: {
        left: '7px',
      },
      state: {
        base: colors.secondary100,
        hover: colors.secondary90,
        focus: colors.dark,
        inactive: colors.light100,
      },
    },
  },
  icons: {
    backup,
    tooltip,
    closePopup,
    pageLeftSideBar: rightDecoration,
    check: checkWhite,
    chevronRight: chevronRightBlack,
    chevronLeft: chevronLeftBlack,
    chevronBottom: chevronBottomBlack,
    chevronDropDownBottom: {
      light: chevronBottomBlack,
      dark: chevronBottomBlack,
    },
  },
};
