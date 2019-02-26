// @flow
import React from 'react';
import styled from 'styled-components';
import { smColors, smFonts } from '/vars';

type SmButtonProps = {
  title: string,
  theme: 'green' | 'orange',
  disabled?: boolean,
  font?: 'fontLight24' | 'fontNormal16' | 'fontNormal14' | 'fontBold14',
  onPress: () => void
};

// $FlowStyledIssue
const StyledRoot = styled.div`
  cursor: pointer;
  border-radius: 0;
  background-color: ${({ theme }) => (theme === 'green' ? smColors.white : smColors.orange)};
  border: 1px solid ${({ theme }) => (theme === 'green' ? smColors.borderGray : smColors.orange)};
  ${({ disabled, theme }) =>
    disabled &&
    `
    border: 1px solid ${smColors.borderGray};
    background-color: ${theme === 'green' ? smColors.white : smColors.borderGray};
    pointer-events: none;
    `}
  &:hover {
    background-color: ${({ theme }) => (theme === 'green' ? `rgba(${smColors.greenRgb}, 0.1)` : `rgba(${smColors.orangeRgb}, 0.71)`)};
  }
  &:active {
    background-color: ${({ theme }) => (theme === 'green' ? smColors.white : smColors.darkOrange)};
    border: 1px solid ${({ theme }) => (theme === 'green' ? smColors.green : smColors.orange)};
  }
`;

const StyledButton = styled.div`
  overflow: hidden;
  padding: 10px;
  padding-top: 6px;
  user-select: none;
`;

// $FlowStyledIssue
const StyledLabel = styled.span`
  textalign: 'center';
  color: ${({ theme }) => (theme === 'green' ? smColors.darkGreen : smColors.white)};
  font-family: ${({ font }) => smFonts[font].fontFamily};
  font-size: ${({ font }) => smFonts[font].fontSize}px;
  font-weight: ${({ font }) => smFonts[font].fontWeight};
`;

const SmButton = (props: SmButtonProps) => {
  const { disabled, onPress, theme, font, title } = props;
  const fontByTheme: string = theme === 'green' ? 'fontNormal14' : 'fontBold14';

  return (
    <StyledRoot theme={theme} onClick={disabled ? undefined : onPress} disabled={disabled}>
      <StyledButton>
        <StyledLabel theme={theme} font={font !== undefined ? font : fontByTheme}>
          {title}
        </StyledLabel>
      </StyledButton>
    </StyledRoot>
  );
};

export default SmButton;
