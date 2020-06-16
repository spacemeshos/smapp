// @flow
import { clipboard } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { eventsService } from '/infra/eventsService';
import { Input, Button, Link } from '/basicComponents';
import { getAbbreviatedText, getAddress } from '/infra/utils';
import smColors from '/vars/colors';
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
  account: Account,
  currentAccountIndex: number,
  history: RouterHistory
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
    const { account } = this.props;
    const { message, isCopied } = this.state;
    return (
      <Wrapper>
        <MiddleSection>
          <MiddleSectionHeader>
            sign text
            <br />
            --
          </MiddleSectionHeader>
          <MiddleSectionText>sign text with account {getAbbreviatedText(getAddress(account.publicKey))}</MiddleSectionText>
          <Input value={message} placeholder="ENTER TEXT TO SIGN" onChange={({ value }) => this.setState({ message: value })} maxLength="64" style={inputStyle} />
          <Button onClick={this.signText} text="SIGN" width={150} isPrimary={false} isDisabled={!message} />
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
    const { account, currentAccountIndex } = this.props;
    const { message } = this.state;
    const signedMessage = await eventsService.signMessage({ message: message.trim(), accountIndex: currentAccountIndex });
    clearTimeout(this.copiedTimeout);
    clipboard.writeText(`{ "text": "${message}", "signature": "0x${signedMessage}", "publicKey": "0x${account.publicKey}" }`);
    this.copiedTimeout = setTimeout(() => this.setState({ isCopied: false }), 10000);
    this.setState({ isCopied: true });
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
