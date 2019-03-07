// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors, smFonts } from '/vars';

// $FlowStyledIssue
const Wrapper = styled.div`
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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
    background-color: ${({ theme }) => (theme === 'green' ? `${smColors.green10alpha}` : `${smColors.orange70alpha}`)};
  }
  &:active {
    background-color: ${({ theme }) => (theme === 'green' ? smColors.white : smColors.darkOrange)};
    border: 1px solid ${({ theme }) => (theme === 'green' ? smColors.green : smColors.orange)};
  }
  transition: background-color 0.16s linear;
`;

// $FlowStyledIssue
const Label = styled.span`
  color: ${({ theme }) => (theme === 'green' ? smColors.darkGreen : smColors.white)};
  font-family: ${({ font }) => smFonts[font].fontFamily};
  font-size: ${({ font }) => smFonts[font].fontSize}px;
  font-weight: ${({ font }) => smFonts[font].fontWeight};
`;

type Props = {
  title: string,
  theme: 'green' | 'orange',
  disabled?: boolean,
  font?: 'fontLight24' | 'fontNormal16' | 'fontNormal14' | 'fontBold14',
  onPress: () => void,
  style?: Object
};

class SmButton extends PureComponent<Props> {
  render() {
    const { disabled, onPress, theme, font, title, style } = this.props;
    const fontByTheme: string = theme === 'green' ? 'fontNormal14' : 'fontBold14';

    return (
      <Wrapper theme={theme} onClick={disabled ? null : onPress} disabled={disabled} style={style}>
        <Label theme={theme} font={font || fontByTheme}>
          {title}
        </Label>
      </Wrapper>
    );
  }
}

export default SmButton;
