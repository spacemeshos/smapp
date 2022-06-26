import React from 'react';
import { ThemeProvider } from 'styled-components';
import modern from '../app/theme/variants/modern'
import dark from '../app/theme/variants/dark'
import light from '../app/theme/variants/light'
import GlobalStyle from '../app/globalStyle'
import { addDecorator } from '@storybook/react';
import { withThemesProvider } from "storybook-addon-styled-component-theme";

const themes = [modern, dark, light].map(theme => ({ ...theme, name: theme.themeName }));
addDecorator(withThemesProvider(themes, ThemeProvider));
addDecorator((Story) => <>
  <GlobalStyle />
  <Story />
</>);



export const decorators = [(Story) => <ThemeProvider
  theme={{
    ...modern
  }}
>
  <GlobalStyle />
  <Story />
</ThemeProvider>];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
