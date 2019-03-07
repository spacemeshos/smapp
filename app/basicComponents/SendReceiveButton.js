// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors, smFonts } from '/vars';
import { sendImageSource, receiveImageSource, sendImageSourceDisabled, receiveImageSourceDisabled } from '/assets/images';

// $FlowStyledIssue
const Wrapper = styled.div`
  height: 90px;
  width: 245px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  border: 1px solid ${({ disabled }) => (disabled ? smColors.borderGray : smColors.green)};
  border-radius: 2px;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  &:hover {
    background-color: ${smColors.green10alpha};
  }
  &:active {
    opacity: 0.8;
  }
  transition: background-color 0.2s linear;
`;

const BtnImage = styled.img`
  height: 40px;
  width: 40px;
  margin-top: 4px;
`;

// $FlowStyledIssue
const Label = styled.div`
  margin: 10px;
  font-family: ${smFonts.fontNormal16.fontFamily};
  font-size: ${smFonts.fontNormal16.fontSize};
  font-weight: ${smFonts.fontNormal16.fontWeight};
  color: ${({ disabled }) => (disabled ? smColors.borderGray : smColors.black)};
`;

type Props = {
  title: 'Send coins' | 'Receive coins',
  disabled?: boolean,
  onPress: () => void
};

class SendReceiveButton extends PureComponent<Props> {
  render() {
    const { disabled, onPress, title } = this.props;
    return (
      <Wrapper disabled={disabled} onClick={disabled ? null : onPress}>
        <BtnImage src={this.getImageSource()} alt="Missing icon" key="btnImage" />,
        <Label disabled={disabled} key="btnLabel">
          {title}
        </Label>
      </Wrapper>
    );
  }

  getImageSource = () => {
    const { disabled, title } = this.props;
    if (disabled) {
      return title === 'Send coins' ? sendImageSourceDisabled : receiveImageSourceDisabled;
    } else {
      return title === 'Send coins' ? sendImageSource : receiveImageSource;
    }
  };
}

export default SendReceiveButton;
