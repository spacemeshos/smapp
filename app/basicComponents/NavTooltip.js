// @flow
import React from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { CorneredWrapper } from '/basicComponents';

const Wrapper = styled(CorneredWrapper)`
  display: none;
  position: absolute;
  z-index: 10;
`;

const Text = styled.div`
  font-size: 10px;
  line-height: 13px;
  text-transform: uppercase;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
  text-align: center;
`;

type Props = {
  text: string,
  className?: string
};

const NavTooltip = ({ text, className }: Props) => (
  <Wrapper className={className}>
    <Text>{text}</Text>
  </Wrapper>
);

export default NavTooltip;
