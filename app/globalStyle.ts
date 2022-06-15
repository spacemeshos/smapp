import { createGlobalStyle } from 'styled-components';
import SourceCodeProRegular from './assets/fonts/SourceCodePro-Regular.ttf';
import SourceCodeProBold from './assets/fonts/SourceCodePro-Bold.ttf';
import { smColors } from './vars';

const GlobalStyle = createGlobalStyle`
    @font-face {
      font-family: SourceCodePro;
      src: url(${SourceCodeProRegular});
      font-style: normal;
      font-weight: 400;
    }
    
    @font-face {
      font-family: SourceCodePro;
      src: url(${SourceCodeProBold});
      font-weight: 800;
    }

    html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: ${({ theme: { skinBackground } }) => skinBackground};
    }
    
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    main, menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      cursor: default;
      font-family: SourceCodePro, sans-serif;
    }

    article, aside, details, figcaption, figure,
    footer, header, hgroup, main, menu, nav, section {
      display: block;
    }

    *[hidden] {
      display: none;
    }

    body {
      line-height: 1;
    }

    ol, ul {
      list-style: none;
    }
    
    input {
      box-sizing: border-box;
      font-weight: 400;
      font-family: SourceCodePro, sans-serif;
    }

    a {
      color: ${smColors.blue};
      cursor: pointer;
    }
`;

export default GlobalStyle;
