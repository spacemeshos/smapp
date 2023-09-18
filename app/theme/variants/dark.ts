import { smColors } from '../../vars';
import colors from '../colors';
import {
  backup,
  tooltipWhite,
  closePopup,
  darkPageLeftSidePanel,
  chevronRightWhite,
  chevronLeftWhite,
  chevronBottomWhite,
  loaderWhite,
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
  chevronBottomBlack,
  settingsIconBlack,
  getCoinsIconBlack,
  helpIconBlack,
  signOutIconBlack,
  upload,
  copyBlack,
  checkWhite,
  chevronRightPurple,
  chevronLeftPurple,
  chevronBottomPurple,
} from '../../assets/images';

export default {
  colors,
  skinBackground: colors.dark100,
  themeName: 'dark',
  isDarkMode: true,
  color: {
    primary: smColors.white,
    contrast: smColors.white,
    gray: smColors.lightGray,
  },
  background: {
    primary: smColors.black,
    active: colors.dark,
    inactive: colors.light140,
  },
  navBar: {
    color: smColors.purple,
  },
  corneredContainer: {
    wrapper: {
      background: smColors.dmBlack2,
      color: smColors.vaultDarkGrey,
    },
  },
  loader: {
    background: smColors.black,
  },
  progressBar: {
    background: smColors.darkGray,
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
      warning: {
        backgroundColor: colors.warning,
        color: colors.light100,
      },
    },
  },
  box: {
    radius: 0,
  },
  indicators: {
    radius: 0,
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
        error: {
          borderColor: colors.error,
        },
      },
      boxRadius: 0,
    },
    dropdown: {
      boxRadius: 0,
      isOutBorder: false,
      dark: {
        isOutBorder: false,
        borderColor: colors.light110,
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
        isOutBorder: false,
        borderColor: colors.light140,
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
        inactive: colors.dark20,
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
        inactive: colors.light140,
      },
    },
  },
  header: {
    color: smColors.white,
  },
  dot: {
    color: smColors.white,
  },
  wrapper: {
    color: smColors.dmBlack2,
  },
  icons: {
    backup,
    tooltip: tooltipWhite,
    closePopup,
    pageLeftSideBar: darkPageLeftSidePanel,
    check: checkWhite,
    chevronRight: chevronRightPurple,
    chevronLeft: chevronLeftPurple,
    chevronBottom: chevronBottomPurple,
    chevronPrimaryDropDownBottom: chevronBottomBlack,
    chevronSecondaryDropDownBottom: chevronBottomWhite,
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
    uploadingContrast: upload,
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
    copySecondary: copyBlack,
    settings: settingsIconBlack,
    getCoins: getCoinsIconBlack,
    help: helpIconBlack,
    signOut: signOutIconBlack,
  },
};
