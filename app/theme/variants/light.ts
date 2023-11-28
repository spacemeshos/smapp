import { smColors } from '../../vars';
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
  loader,
  sidePanelLeftLong,
  sidePanelRightLong,
  logo,
  horizontalPanelWhite,
  sidePanelLeftMed,
  sidePanelRightMed,
  upload,
  posSmesherBlack,
  walletSecondBlack,
  topLeftCorner,
  topRightCorner,
  bottomLeftCorner,
  bottomRightCorner,
  posDirectoryBlack,
  fireworks,
  leftSideTIcon,
  copyBlack,
  chevronBottomWhite,
  settingsIcon,
  getCoinsIcon,
  helpIcon,
  signOutIcon,
  uploadWhite,
  copyWhite,
  posDirectoryWhite,
} from '../../assets/images';

export default {
  colors,
  skinBackground: colors.light110,
  themeName: 'light',
  isDarkMode: false,
  color: {
    primary: smColors.black,
    contrast: smColors.realBlack,
    gray: smColors.darkGray,
  },
  background: {
    primary: smColors.black,
    active: colors.dark,
    inactive: colors.light140,
  },
  navBar: {
    color: smColors.darkGray,
  },
  corneredContainer: {
    wrapper: {
      background: smColors.lightGray,
      color: smColors.vaultLightGrey,
    },
  },
  loader: {
    background: smColors.background,
  },
  progressBar: {
    background: smColors.disabledGray,
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
    color: smColors.black,
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
        error: {
          borderColor: colors.error,
        },
      },
      boxRadius: 0,
    },
    dropdown: {
      boxRadius: 0,
      isOutBorder: true,
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
        inactive: colors.light140,
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
    color: smColors.realBlack,
  },
  dot: {
    color: smColors.realBlack,
  },
  wrapper: {
    color: smColors.black02Alpha,
  },
  icons: {
    backup,
    tooltip,
    closePopup,
    pageLeftSideBar: rightDecoration,
    check: checkWhite,
    chevronRight: chevronRightBlack,
    chevronPrimaryDropDownBottom: chevronBottomBlack,
    chevronSecondaryDropDownBottom: chevronBottomWhite,
    chevronPrimaryRight: chevronRightBlack,
    chevronPrimaryLeft: chevronLeftBlack,
    loader,
    sidePanelLeft: sidePanelLeftLong,
    sidePanelRight: sidePanelRightLong,
    logo,
    horizontalPanel: horizontalPanelWhite,
    sidePanelLeftMed,
    sidePanelRightMed,
    uploading: upload,
    uploadingContrast: uploadWhite,
    posSmesher: posSmesherBlack,
    walletSecond: walletSecondBlack,
    corners: {
      topLeft: topLeftCorner,
      topRight: topRightCorner,
      bottomLeft: bottomLeftCorner,
      bottomRight: bottomRightCorner,
    },
    posDirectory: posDirectoryBlack,
    posDirectoryContrast: posDirectoryWhite,
    fireworks,
    leftSideTIcon,
    copy: copyBlack,
    copySecondary: copyWhite,
    settings: settingsIcon,
    getCoins: getCoinsIcon,
    help: helpIcon,
    signOut: signOutIcon,
  },
};
