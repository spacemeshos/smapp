import React from 'react';
import styled from 'styled-components';
import { smColors } from '../vars';

const Dot = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
  }
  ::before {
      float: left;
      width: 0;
      white-space: nowrap;
      content:
      "................................................."
      "................................................."
    }
`;

const Dots = () => <Dot />;

export default Dots;
