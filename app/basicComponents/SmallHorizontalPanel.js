// @flow
import React from 'react';
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

const SmallHorizontalPanel = () => <Wrapper src={icon} />;

export default SmallHorizontalPanel;
