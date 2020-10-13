// @flow
import { clipboard } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { eventsService } from '/infra/eventsService';
import { Modal } from '/components/common';
import { Input, Button } from '/basicComponents';
import { getAbbreviatedText, getAddress } from '/infra/utils';
import { smColors } from '/vars';
import type { Account } from '/types';

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 30px 0 15px 0;
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
      <Modal header="SIGN TEXT" subHeader={`sign text with account ${getAbbreviatedText(getAddress(accounts[index].publicKey))}`}>
        <Input value={message} placeholder="ENTER TEXT TO SIGN" onChange={({ value }) => this.setState({ message: value })} maxLength="64" style={inputStyle} />
        <ButtonsWrapper>
          <Button onClick={this.signText} text="SIGN" width={150} isDisabled={!message} />
          <Button onClick={close} isPrimary={false} text="Cancel" />
        </ButtonsWrapper>
        <CopiedText>{isCopied ? 'COPIED' : ' '}</CopiedText>
      </Modal>
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
