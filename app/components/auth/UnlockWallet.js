// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { deriveEncryptionKey, unlockWallet } from '/redux/wallet/actions';
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
  setCreationMode: () => void,
  navigateToWallet: () => void,
  deriveEncryptionKey: Action,
  unlockWallet: Action
};

type State = {
  passphrase: string,
  errorMsg: ?string
};

class UnlockWallet extends Component<Props, State> {
  state = {
    passphrase: '',
    errorMsg: null
  };

  render() {
    const { setCreationMode } = this.props;
    const { passphrase, errorMsg } = this.state;
    return (
      <Wrapper>
        <UpperPart>
          <ImageWrapper>
            <Image src={welcomeBack} />
          </ImageWrapper>
          <UpperPartHeader>Enter passphrase to access wallet</UpperPartHeader>
          <SmInput type="passphrase" placeholder="Type passphrase" errorMsg={errorMsg} onChange={this.handlePasswordTyping} />
        </UpperPart>
        <BottomPart>
          <SmButton text="Login" isDisabled={!passphrase || !!errorMsg} theme="orange" onPress={this.decryptWallet} style={{ marginTop: 20 }} />
          <LinksWrapper>
            <SmallLink onClick={setCreationMode}>Create a new wallet</SmallLink>
            <SmallLink onClick={setCreationMode}>Restore wallet</SmallLink>
          </LinksWrapper>
        </BottomPart>
      </Wrapper>
    );
  }

  handlePasswordTyping = ({ value }: { value: string }) => {
    this.setState({ passphrase: value, errorMsg: null });
  };

  decryptWallet = async () => {
    const { deriveEncryptionKey, unlockWallet, navigateToWallet } = this.props;
    const { passphrase } = this.state;
    if (passphrase.trim().length >= 8) {
      try {
        deriveEncryptionKey({ passphrase });
        await unlockWallet({ shouldPromtUser: true });
        navigateToWallet();
      } catch {
        this.setState({ errorMsg: 'Passphrase Incorrect.' });
      }
    } else {
      this.setState({ errorMsg: 'Passphrase cannot be less than 8 characters.' });
    }
  };
}

const mapDispatchToProps = {
  deriveEncryptionKey,
  unlockWallet
};

UnlockWallet = connect(
  null,
  mapDispatchToProps
)(UnlockWallet);

export default UnlockWallet;
