// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

// $FlowStyledIssue
const Wrapper = styled.div`
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  cursor: pointer;
  background-color: ${({ theme }) => (theme === 'green' ? smColors.white : smColors.orange)};
  border: 1px solid ${({ theme }) => (theme === 'green' ? smColors.borderGray : smColors.orange)};
  ${({ disabled, theme }) =>
    disabled &&
    `
    border: 1px solid ${smColors.borderGray};
    background-color: ${theme === 'green' ? smColors.white : smColors.borderGray};
    pointer-events: none;
    cursor: default;
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
const Text = styled.span`
  color: ${({ theme }) => (theme === 'green' ? smColors.darkGreen : smColors.white)};
  font-size: 14px;
  font-weight: ${({ theme }) => (theme === 'green' ? 'normal' : 'bold')};
  cursor: inherit;
`;

type Props = {
  text: string,
  theme: 'green' | 'orange',
  disabled?: boolean,
  onPress: () => void,
  style?: Object
};

class SmButton extends PureComponent<Props> {
  render() {
    const { disabled, onPress, theme, text, style } = this.props;
    return (
      <Wrapper theme={theme} onClick={disabled ? null : onPress} disabled={disabled} style={style}>
        <Text theme={theme}>{text}</Text>
      </Wrapper>
    );
  }
}

export default SmButton;
