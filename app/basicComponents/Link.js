// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const Wrapper = styled.div`
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
  onClick: Function,
  isPrimary?: boolean,
  isDisabled?: boolean,
  text: string,
  style?: Object
};

class Link extends PureComponent<Props> {
  static defaultProps = {
    isPrimary: true,
    isDisabled: false
  };

  render() {
    const { onClick, isPrimary, isDisabled, text, style } = this.props;
    return (
      <Wrapper onClick={isDisabled ? null : onClick} isPrimary={isPrimary} isDisabled={isDisabled} style={style}>
        {text}
      </Wrapper>
    );
  }
}

export default Link;
