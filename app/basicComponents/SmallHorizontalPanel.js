// @flow
import React from 'react';
import styled from 'styled-components';
import { horizontalPanelBlack, horizontalPanelWhite } from '/assets/images';

const Wrapper = styled.img`
  position: absolute;
  top: -25px;
  right: 0px;
  width: 60px;
  height: 15px;
`;
type Props = {
  isDarkModeOn: boolean
};

const SmallHorizontalPanel = ({ isDarkModeOn }: Props) => <Wrapper src={isDarkModeOn ? horizontalPanelWhite : horizontalPanelBlack} />;

export default SmallHorizontalPanel;
