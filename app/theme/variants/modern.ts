import { smColors } from '../../vars';
import colors from '../colors';
import {
  modernBackup,
  modernInfoTooltip,
  modernErrorPopupContact,
  darkPageLeftSidePanel,
  modernCheck,
  chevronRightPurple,
  chevronLeftPurple,
  chevronBottomPurple,
  chevronBottomWhite,
  chevronBottomBlack,
  loaderWhite,
  chevronRightWhite,
  chevronLeftWhite,
  sidePanelLeftLongWhite,
  sidePanelRightLongWhite,
  logoWhite,
  horizontalPanelBlack,
  sidePanelLeftMedWhite,
  sidePanelRightMedWhite,
  uploadWhite,
  posSmesherWhite,
  walletSecondWhite,
  topLeftCornerWhite,
  topRightCornerWhite,
  bottomLeftCornerWhite,
  bottomRightCornerWhite,
  posDirectoryWhite,
  fireworksWhite,
  leftSideTIconWhite,
  copyWhite,
} from '../../assets/images';

export default {
  colors,
  skinBackground: colors.dark100,
  isDarkMode: true,
  themeName: 'modern',
  background: {
    active: colors.dark,
    inactive: colors.light140,
  },
  popups: {
    boxRadius: 10,
    iconRadius: 20,
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
    radius: 10,
  },
  indicators: {
    radius: 4,
    color: smColors.white,
  },
  form: {
    input: {
      states: {
        disable: {
          hasBorder: false,
          borderColor: colors.dark30,
          backgroundColor: colors.dark30,
          color: colors.dark35,
        },
        normal: {
          backgroundColor: colors.light110,
          color: colors.dark45,
          hasBorder: false,
          borderColor: colors.dark30,
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
      boxRadius: 8,
    },
    dropdown: {
      boxRadius: 10,
      dark: {
        borderColor: colors.light110,
        isOutBorder: false,
        states: {
          disable: {
            backgroundColor: colors.light110,
            color: colors.dark45,
          },
          normal: {
            backgroundColor: colors.dark100,
            color: colors.light100,
          },
          click: {
            backgroundColor: colors.dark10,
            color: colors.light100,
          },
          hover: {
            backgroundColor: colors.dark10,
            color: colors.light100,
          },
        },
      },
      light: {
        borderColor: colors.light140,
        isOutBorder: false,
        states: {
          disable: {
            backgroundColor: colors.light110,
            color: colors.dark45,
          },
          normal: {
            backgroundColor: colors.light110,
            color: colors.dark45,
          },
          click: {
            backgroundColor: colors.dark20,
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
        hasBorder: false,
      },
      boxRadius: 20,
      padding: {
        left: '10%',
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
        hasBorder: false,
      },
      boxRadius: 20,
      padding: {
        left: '10%',
      },
      state: {
        base: colors.secondary100,
        hover: colors.secondary90,
        focus: colors.dark,
        inactive: colors.light100,
      },
    },
  },
  header: {
    color: smColors.white,
  },
  icons: {
    backup: modernBackup,
    tooltip: modernInfoTooltip,
    closePopup: modernErrorPopupContact,
    pageLeftSideBar: darkPageLeftSidePanel,
    check: modernCheck,
    chevronRight: chevronRightPurple,
    chevronLeft: chevronLeftPurple,
    chevronBottom: chevronBottomPurple,
    chevronDropDownBottom: {
      light: chevronBottomBlack,
      dark: chevronBottomWhite,
    },
    chevronPrimaryRight: chevronRightWhite,
    chevronPrimaryLeft: chevronLeftWhite,
    loader: loaderWhite,
    sidePanelLeft: sidePanelLeftLongWhite,
    sidePanelRight: sidePanelRightLongWhite,
    logo: logoWhite,
    horizontalPanel: horizontalPanelBlack,
    sidePanelLeftMed: sidePanelLeftMedWhite,
    sidePanelRightMed: sidePanelRightMedWhite,
    uploading: uploadWhite,
    posSmesher: posSmesherWhite,
    walletSecond: walletSecondWhite,
    corners: {
      topLeft: topLeftCornerWhite,
      topRight: topRightCornerWhite,
      bottomLeft: bottomLeftCornerWhite,
      bottomRight: bottomRightCornerWhite,
    },
    posDirectory: posDirectoryWhite,
    fireworks: fireworksWhite,
    leftSideTIcon: leftSideTIconWhite,
    copy: copyWhite,
  },
};
