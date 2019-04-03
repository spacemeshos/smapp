// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { arrowUpGreen, arrowDownGreen, arrowUpGrey, arrowDownGrey } from '/assets/images';

// $FlowStyledIssue
const Wrapper = styled.div`
  width: 100%;
  height: 90px;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ disabled }) => (disabled ? smColors.borderGray : smColors.green)};
  border-radius: 2px;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  background-color: ${smColors.white};
  &:hover {
    background-color: ${smColors.green10alpha};
  }
  &:active {
    opacity: 0.8;
  }
  transition: background-color 0.2s linear;
`;

const Image = styled.img`
  height: 40px;
  width: 40px;
  margin-right: 30px;
  cursor: inherit;
`;

// $FlowStyledIssue
const Label = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${({ disabled }) => (disabled ? smColors.borderGray : smColors.black)};
  cursor: inherit;
`;

type Props = {
  title: string,
  disabled?: boolean,
  onPress: () => void
};

class SendReceiveButton extends PureComponent<Props> {
  static titles = {
    SEND: 'Send coins',
    RECEIVE: 'Receive coins'
  };

  render() {
    const { disabled, onPress, title } = this.props;
    return (
      <Wrapper disabled={disabled} onClick={disabled ? null : onPress}>
        <Image src={this.getImageSource()} alt="Sm button icon" />
        <Label disabled={disabled}>{title}</Label>
      </Wrapper>
    );
  }

  getImageSource = () => {
    const { disabled, title } = this.props;
    if (disabled) {
      return title === 'Send coins' ? arrowUpGrey : arrowDownGrey;
    } else {
      return title === 'Send coins' ? arrowUpGreen : arrowDownGreen;
    }
  };
}

export default SendReceiveButton;
