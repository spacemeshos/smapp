import React from 'react';
import styled from 'styled-components';
import { smColors } from '../vars';

const Wrapper = styled.div<{ onClick: (e?: React.MouseEvent) => void; isPrimary: boolean; isDisabled: boolean }>`
  font-size: 14px;
  line-height: 17px;
  font-family: ${({ isPrimary }) => (isPrimary ? 'SourceCodePro' : 'SourceCodeProBold')};
  text-decoration: underline;
  ${({ isDisabled, isPrimary }) =>
    isDisabled
      ? `color: ${smColors.disabledGray};`
      : `
  color: ${isPrimary ? smColors.blue : smColors.purple};
  &:hover {
    color: ${isPrimary ? smColors.darkerBlue : smColors.darkerPurple};
  }
    &:active {
      color: ${smColors.black};
      }
    `}
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
`;

type Props = {
  onClick: (e?: React.MouseEvent) => void;
  isPrimary?: boolean;
  isDisabled?: boolean;
  text: string;
  style?: any;
};

const Link = ({ onClick, isPrimary = true, isDisabled = false, text, style }: Props) => (
  <Wrapper onClick={isDisabled ? () => {} : onClick} isPrimary={isPrimary} isDisabled={isDisabled} style={style}>
    {text}
  </Wrapper>
);

export default Link;
