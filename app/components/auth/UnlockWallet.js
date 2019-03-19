// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createFileEncryptionKey, reopenWallet } from '/redux/auth/actions';
import { SmButton, SmInput } from '/basicComponents';
import { welcomeBack } from '/assets/images';
import { smColors } from '/vars';
import type { Action } from '/types';

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

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const UpperPartHeader = styled.span`
  font-size: 24px;
  text-align: left;
  color: ${smColors.black};
`;

const SmallLink = styled.span`
  font-size: 14px;
  user-select: none;
  color: ${smColors.green};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const LinksWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

type Props = {
  setCreationMode: Function,
  navigateToWallet: Function,
  createFileEncryptionKey: Action,
  reopenWallet: Action
};

type State = {
  passphrase: string,
  errorMessage: ?string
};

class UnlockWallet extends Component<Props, State> {
  state = {
    passphrase: '',
    errorMessage: null
  };

  render() {
    const { setCreationMode } = this.props;
    const { passphrase, errorMessage } = this.state;
    return (
      <Wrapper>
        <UpperPart>
          <ImageWrapper>
            <Image src={welcomeBack} />
          </ImageWrapper>
          <UpperPartHeader>Enter passphrase to access wallet</UpperPartHeader>
          <SmInput type="passphrase" placeholder="Type passphrase" errorMessage={errorMessage} onChange={this.handlePasswordTyping} hasDebounce />
        </UpperPart>
        <BottomPart>
          <SmButton text="Login" disabled={!passphrase || !!errorMessage} theme="orange" onPress={this.decryptWallet} style={{ marginTop: 20 }} />
          <LinksWrapper>
            <SmallLink onClick={setCreationMode}>Create a new wallet</SmallLink>
            <SmallLink onClick={setCreationMode}>Restore wallet</SmallLink>
          </LinksWrapper>
        </BottomPart>
      </Wrapper>
    );
  }

  handlePasswordTyping = ({ value }: { value: string }) => {
    this.setState({ passphrase: value, errorMessage: null });
  };

  decryptWallet = () => {
    const { createFileEncryptionKey, reopenWallet, navigateToWallet } = this.props;
    const { passphrase } = this.state;
    if (passphrase.trim().length >= 8) {
      try {
        createFileEncryptionKey({ passphrase });
        reopenWallet({ isLoggingIn: true });
        navigateToWallet();
      } catch {
        this.setState({ errorMessage: 'Error. Passphrase Incorrect.' });
      }
    } else {
      this.setState({ errorMessage: 'Error. Passphrase cannot be less than 8 characters.' });
    }
  };
}

const mapDispatchToProps = {
  createFileEncryptionKey,
  reopenWallet
};

UnlockWallet = connect(
  null,
  mapDispatchToProps
)(UnlockWallet);

export default UnlockWallet;
