// @flow
import { clipboard } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { eventsService } from '/infra/eventsService';
import { Input, Button, Link } from '/basicComponents';
import { getAbbreviatedText, getAddress } from '/infra/utils';
import smColors from '/vars/colors';
import { copyToClipboard } from '/assets/images';
import type { RouterHistory } from 'react-router-dom';
import type { Account } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 700px;
  height: 100%;
  margin-right: 10px;
  padding: 25px 15px;
  background-color: ${smColors.black02Alpha};
`;

const MiddleSectionHeader = styled.div`
  margin-bottom: 10px;
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
`;

const MiddleSectionText = styled.div`
  margin-bottom: 45px;
  font-size: 15px;
  line-height: 20px;
  color: ${smColors.black};
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const CopyIcon = styled.img`
  position: absolute;
  top: 12px;
  right: 17px;
  width: 16px;
  height: 15px;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
  &:active {
    transform: translate3d(2px, 2px, 0);
  }
`;

const FakeInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
  padding: 8px 10px;
  border: 1px solid ${smColors.black};
  background-color: ${smColors.white};
  font-size: 14px;
  line-height: 16px;
  color: ${({ hasText }) => (hasText ? smColors.green : smColors.mediumGray)};
  cursor: ${({ hasText }) => (hasText ? 'text' : 'default')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CopyIcon1 = styled.img`
  width: 16px;
  height: 15px;
  margin: 12px 6px 12px auto;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
  &:active {
    transform: translate3d(2px, 2px, 0);
  }
`;

const CopiedText = styled.div`
  margin-top: 10px;
  text-align: left;
  font-size: 14px;
  line-height: 16px;
  height: 20px;
  color: ${smColors.green};
`;

const inputStyle = { paddingRight: 35, backgroundColor: smColors.white };

type Props = {
  account: Account,
  currentAccountIndex: number,
  history: RouterHistory
};

type State = {
  message: string,
  signedMessage: string,
  isCopied: boolean
};

class SignMessage extends Component<Props, State> {
  copiedTimeout: TimeoutID;

  state = {
    message: '',
    signedMessage: '',
    isCopied: false
  };

  render() {
    const { account } = this.props;
    const { message, signedMessage, isCopied } = this.state;
    return (
      <Wrapper>
        <MiddleSection>
          <MiddleSectionHeader>
            sign text
            <br />
            --
          </MiddleSectionHeader>
          <MiddleSectionText>sign text with account {getAbbreviatedText(getAddress(account.publicKey))}</MiddleSectionText>
          <InputWrapper>
            <Input value={message} placeholder="Enter text to sign" onChange={({ value }) => this.setState({ message: value })} maxLength="64" style={inputStyle} />
            <CopyIcon src={copyToClipboard} onClick={this.copyMessage} />
          </InputWrapper>
          <FakeInput hasText={!!signedMessage}>
            {signedMessage ? `${getAbbreviatedText(signedMessage, true, 33)}` : 'click "sign" to create a signature'}
            <CopyIcon1 src={copyToClipboard} onClick={this.copySignedText} />
          </FakeInput>
          <Button onClick={this.signText} text="Sign" width={150} isPrimary={false} isDisabled={!message} />
          {isCopied && <CopiedText>COPIED</CopiedText>}
          <Link onClick={this.returnToMainScreen} text="Cancel" style={{ margin: 'auto auto 0 0', color: smColors.orange }} />
        </MiddleSection>
      </Wrapper>
    );
  }

  componentWillUnmount() {
    this.copiedTimeout && clearTimeout(this.copiedTimeout);
  }

  signText = async () => {
    const { currentAccountIndex } = this.props;
    const { message } = this.state;
    const signedMessage = await eventsService.signMessage({ message: message.trim(), accountIndex: currentAccountIndex });
    this.setState({ signedMessage });
  };

  copyMessage = () => {
    const { message } = this.state;
    if (message) {
      clearTimeout(this.copiedTimeout);
      clipboard.writeText(message);
      this.copiedTimeout = setTimeout(() => this.setState({ isCopied: false }), 10000);
      this.setState({ isCopied: true });
    }
  };

  copySignedText = () => {
    const { signedMessage } = this.state;
    if (signedMessage) {
      clearTimeout(this.copiedTimeout);
      clipboard.writeText(`0x${signedMessage}`);
      this.copiedTimeout = setTimeout(() => this.setState({ isCopied: false }), 10000);
      this.setState({ isCopied: true });
    }
  };

  returnToMainScreen = () => {
    const { history } = this.props;
    history.push('/main/wallet/overview');
  };
}

const mapStateToProps = (state) => ({
  account: state.wallet.accounts[state.wallet.currentAccountIndex],
  currentAccountIndex: state.wallet.currentAccountIndex
});

SignMessage = connect<any, any, _, _, _, _>(mapStateToProps)(SignMessage);
export default SignMessage;
