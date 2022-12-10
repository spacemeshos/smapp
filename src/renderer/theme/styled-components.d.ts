import 'styled-components';
import modern from './variants/modern';

type CustomTheme = typeof modern;

declare module 'styled-components' {
  export interface DefaultTheme extends CustomTheme {
    isDarkMode: boolean;
  }
}
