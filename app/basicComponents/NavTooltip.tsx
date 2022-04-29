import React from 'react';
import styled from 'styled-components';
import { smColors } from '../vars';
import CorneredWrapper from './CorneredWrapper';

const Wrapper = styled(CorneredWrapper)`
  display: none;
  position: absolute;
  z-index: 10;
`;

const Text = styled.div`
  font-size: 10px;
  line-height: 13px;
  text-transform: uppercase;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.realBlack};
  text-align: center;
`;

type Props = {
  text: string;
  isDarkMode?: boolean;
  className?: string;
};

const NavTooltip = ({ text, isDarkMode = false, className }: Props) => (
  <Wrapper isDarkMode={isDarkMode} className={className}>
    <Text>{text}</Text>
  </Wrapper>
);

export default NavTooltip;
