import colors from '../colors';

export default {
  colors,
  themeName: 'dark',
  background: {
    active: colors.dark,
    inactive: colors.light140,
  },
  box: {
    radius: 0,
  },
  form: {
    input: {
      states: {
        disable: {
          backgroundColor: colors.dark30,
          color: colors.dark30,
        },
        normal: {
          backgroundColor: colors.dark30,
          color: colors.dark35,
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
      dark: {
        states: {
          disable: {
            backgroundColor: colors.dark100,
            color: colors.dark45,
          },
          normal: {
            backgroundColor: colors.dark100,
            color: colors.dark45,
          },
          click: {
            backgroundColor: colors.dark100,
            color: colors.dark45,
          },
          hover: {
            backgroundColor: colors.dark10,
            color: colors.dark45,
          },
        },
      },
      light: {
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
            backgroundColor: colors.light110,
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
        base: colors.primary,
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
};
