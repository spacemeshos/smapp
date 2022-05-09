import colors from '../colors';

export default {
  colors,
  themeName: 'light',
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
        normal: {
          backgroundColor: colors.dark30,
          color: colors.light150,
        },
        click: {
          backgroundColor: colors.light120,
          color: colors.dark45,
        },
        focus: {
          backgroundColor: colors.light120,
          color: colors.dark45,
        },
      },
      boxRadius: 0,
    },
    dropdown: {
      light: {
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
            backgroundColor: colors.light120,
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
