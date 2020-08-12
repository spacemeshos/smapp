// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { horizontalPanelBlack, horizontalPanelWhite } from '/assets/images';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const icon = isDarkModeOn ? horizontalPanelWhite : horizontalPanelBlack;

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
    return <Wrapper src={icon} />;
  }
}

export default SmallHorizontalPanel;
