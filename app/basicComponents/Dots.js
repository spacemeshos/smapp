// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

const Dot = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  color: ${isDarkModeOn ? smColors.white : smColors.realBlack};
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
