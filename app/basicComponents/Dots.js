// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const Dot = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
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

class Dots extends PureComponent<Props> {
  render() {
    return <Dot />;
  }
}

export default Dots;
