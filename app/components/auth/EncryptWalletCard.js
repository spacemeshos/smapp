// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createFileEncryptionKey } from '/redux/wallet/actions';
import { SmButton, SmInput, Loader } from '/basicComponents';
import { smColors } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  padding: 30px;
`;

const UpperPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const BottomPart = styled.div`
  display: flex;
  flex-direction: column;
`;

const GrayText = styled.span`
  font-size: 16px;
  text-align: left;
  color: ${smColors.textGray};
`;

const UpperPartHeader = styled.span`
  font-size: 24px;
  text-align: left;
  color: ${smColors.black};
`;

const Link = styled(GrayText)`
  font-size: 16px;
  text-align: left;
  color: ${smColors.green};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const LoaderWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  proceedToStep3: Function,
  createFileEncryptionKey: Function
};

type State = {
  pinCode: string,
  verifiedPinCode: string,
  hasPinCodeError: boolean,
  hasVerifyPinCodeError: boolean,
  isLoaderVisible: boolean
};

class EncryptWalletCard extends Component<Props, State> {
  state = {
    pinCode: '',
    verifiedPinCode: '',
    hasPinCodeError: false,
    hasVerifyPinCodeError: false,
    isLoaderVisible: false
  };

  render() {
    const { hasPinCodeError, hasVerifyPinCodeError, isLoaderVisible } = this.state;
    if (isLoaderVisible) {
      return (
        <LoaderWrapper>
          <Loader size="BIG" />
        </LoaderWrapper>
      );
    }
    return (
      <Wrapper>
        <UpperPart>
          <UpperPartHeader>Encrypt your Wallet</UpperPartHeader>
          <GrayText>Must be at least 8 characters</GrayText>
          <SmInput type="password" placeholder="Type password" hasError={hasPinCodeError} onChange={this.handlePasswordTyping} hasDebounce />
          <SmInput type="password" placeholder="Verify password" hasError={hasVerifyPinCodeError} onChange={this.handlePasswordVerifyTyping} hasDebounce />
          <GrayText>
            Your Wallet file is encrypted and saved on your computer. <Link>Show me the file</Link>
          </GrayText>
        </UpperPart>
        <BottomPart>
          <SmButton text="Next" theme="orange" onPress={this.createWallet} style={{ marginTop: 20 }} />
        </BottomPart>
      </Wrapper>
    );
  }

  handlePasswordTyping = ({ value }: { value: string }) => {
    this.setState({ pinCode: value, hasPinCodeError: false });
  };

  handlePasswordVerifyTyping = ({ value }: { value: string }) => {
    this.setState({ verifiedPinCode: value, hasVerifyPinCodeError: false });
  };

  validate = () => {
    const { pinCode, verifiedPinCode } = this.state;
    const hasPinCodeError = !pinCode || (!!pinCode && pinCode.length < 8);
    const hasVerifyPinCodeError = !verifiedPinCode || pinCode !== verifiedPinCode;
    this.setState({ hasPinCodeError, hasVerifyPinCodeError });
    return !hasPinCodeError && !hasVerifyPinCodeError;
  };

  createWallet = () => {
    const { createFileEncryptionKey, proceedToStep3 } = this.props;
    const { pinCode, isLoaderVisible } = this.state;
    const canProceed = this.validate();
    if (canProceed && !isLoaderVisible) {
      this.setState({ isLoaderVisible: true });
      setTimeout(() => {
        createFileEncryptionKey({ pinCode });
        proceedToStep3();
      }, 1000);
    }
  };
}

const mapDispatchToProps = {
  createFileEncryptionKey
};

EncryptWalletCard = connect(
  null,
  mapDispatchToProps
)(EncryptWalletCard);
export default EncryptWalletCard;
