// @flow
import React from 'react';
import styled from 'styled-components';
import { tooltip, tooltipWhite } from '/assets/images';
import { smColors } from '/vars';

const InnerWrapper = styled.div`
  display: none;
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  width: ${({ width }) => width}px;
  padding: 10px 15px;
  background-color: ${smColors.disabledGray};
  border: 1px solid ${smColors.realBlack};
  z-index: 10;
`;

const InnerIcon = styled.img`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 13px;
  height: 13px;
`;

const Text = styled.div`
  font-size: 10px;
  line-height: 13px;
  text-transform: uppercase;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.black)};
`;

const OuterIcon = styled.img`
  width: 13px;
  height: 13px;
`;

const Wrapper = styled.div`
  position: relative;
  margin-left: 5px;
  margin-top: ${({ marginTop }) => marginTop}px;
  &:hover ${InnerWrapper} {
    display: block;
  }
`;

type Props = {
  top: number,
  left: number,
  width: number,
  marginTop?: number,
  text: string,
  isDarkModeOn: boolean
};

const Tooltip = ({ top = -2, left = -3, width, text, marginTop = 2, isDarkModeOn }: Props) => (
  <Wrapper marginTop={marginTop}>
    <OuterIcon src={isDarkModeOn ? tooltipWhite : tooltip} />
    <InnerWrapper top={top} left={left} width={width}>
      <InnerIcon src={isDarkModeOn ? tooltipWhite : tooltip} />
      <Text>{text}</Text>
    </InnerWrapper>
  </Wrapper>
);

export default Tooltip;
