// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { horizontalPanelSmall } from '/assets/images';

const Wrapper = styled.img`
  position: absolute;
  top: -25px;
  right: 0px;
  width: 60px;
  height: 15px;
`;

type Props = {};

class SmallHorizontalPanel extends PureComponent<Props> {
  render() {
    return <Wrapper src={horizontalPanelSmall} />;
  }
}

export default SmallHorizontalPanel;
