// @flow
import { clipboard } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { eventsService } from '/infra/eventsService';
import { Input, Button, Link } from '/basicComponents';
import { getAbbreviatedText, getAddress } from '/infra/utils';
import { smColors } from '/vars';
import type { Account } from '/types';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 2;
`;

const InnerWrapper = styled.div`
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
  background-color: ${isDarkModeOn ? smColors.dmBlack2 : smColors.black02Alpha};
`;

const MiddleSectionHeader = styled.div`
  margin-bottom: 10px;
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  color: ${isDarkModeOn ? smColors.white : smColors.black};
`;

const MiddleSectionText = styled.div`
  margin-bottom: 45px;
  font-size: 15px;
  line-height: 20px;
  color: ${isDarkModeOn ? smColors.white : smColors.black};
`;

const CopiedText = styled.div`
  margin-top: 10px;
  text-align: left;
  font-size: 14px;
  line-height: 16px;
  height: 20px;
  color: ${smColors.green};
`;

const inputStyle = { marginBottom: 20 };

type Props = {
  accounts: Account[],
  index: number,
  close: () => void
};

type State = {
  message: string,
  isCopied: boolean
};

class SignMessage extends Component<Props, State> {
  copiedTimeout: TimeoutID;

  state = {
    message: '',
    isCopied: false
  };

  render() {
    const { accounts, index, close } = this.props;
    const { message, isCopied } = this.state;
    return (
      <Wrapper>
        <InnerWrapper>
          <MiddleSection>
            <MiddleSectionHeader>
              sign text
              <br />
              --
            </MiddleSectionHeader>
            <MiddleSectionText>sign text with account {getAbbreviatedText(getAddress(accounts[index].publicKey))}</MiddleSectionText>
            <Input value={message} placeholder="ENTER TEXT TO SIGN" onChange={({ value }) => this.setState({ message: value })} maxLength="64" style={inputStyle} />
            <Button onClick={this.signText} text="SIGN" width={150} isDisabled={!message} />
            {isCopied && <CopiedText>COPIED</CopiedText>}
            <Link onClick={close} text="Cancel" style={{ margin: '30px auto 15px 0', color: smColors.orange }} />
          </MiddleSection>
        </InnerWrapper>
      </Wrapper>
    );
  }

  componentWillUnmount() {
    this.copiedTimeout && clearTimeout(this.copiedTimeout);
  }

  signText = async () => {
    const { accounts, index } = this.props;
    const { message } = this.state;
    const signedMessage = await eventsService.signMessage({ message: message.trim(), accountIndex: index });
    clearTimeout(this.copiedTimeout);
    clipboard.writeText(`{ "text": "${message}", "signature": "0x${signedMessage}", "publicKey": "0x${accounts[index].publicKey}" }`);
    this.copiedTimeout = setTimeout(() => this.setState({ isCopied: false }), 10000);
    this.setState({ isCopied: true });
  };
}

const mapStateToProps = (state) => ({
  accounts: state.wallet.accounts
});

SignMessage = connect<any, any, _, _, _, _>(mapStateToProps)(SignMessage);
export default SignMessage;
